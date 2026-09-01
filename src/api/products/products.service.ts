import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ){}

  private async getCategoryById(category_id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id }
    });
    if (!category) {
      throw new NotFoundException(
        `Category ${category_id} not found`
      );
    }
    return category;
  }

  /**
   *  Remove category_id from the request body because
   *  Product entity expects a Category object:
   *  category: Category
   */
  async create(body: CreateProductDto) {
    const { category_id, ...rest } = body;
    const category = await this.getCategoryById(category_id);

    const product = this.productRepository.create({...rest,  category});

    // @ManyToOne()
    // category: Category; //category: Category → used for TypeORM relationship
    // A Product does not store only a category ID. It stores a Category object as a relationship.
    return this.productRepository.save(product);
  }

   async findAll(name?: string) {
    const where: any = {};
    if(name) {
      where.product_name = ILike(`%${name}%`);
    }
    return this.productRepository.find({where});
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { product_id: id},
      relations: {category: true}
    });
    if(!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.findOne(id);
    const category = await this.getCategoryById(product.category_id);
    Object.assign(product, { ...body, category });
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
  
}
