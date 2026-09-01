import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ){}

  /**
   *  Create entity -> Save to database
   *  create(): Create entity object
   *  save(): Insert/update database
   *  Use await when you need the result before continuing.
   * @param body 
   * @returns 
   */
  async create(body: CreateCategoryDto) {
    const categories = this.categoryRepository.create(body);
    return this.categoryRepository.save(categories);
  }

  async findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        category_id: id
      },
      relations: {
        products: true
      }
    });
    if(!category) {
      throw new NotFoundException(`Category ${id} not found.`);
    }
    return category;
  }

  async update(id: number, body: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, body);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }
}
