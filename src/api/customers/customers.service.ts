import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CustomersService {

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ){}

  //Use await when you need the result before continuing.
  async create(body: CreateCustomerDto) {
    const customers = await this.customerRepository.create(body);
    return this.customerRepository.save(customers);
  }

  // Without await when you don't need the result before continuing.
  async findAll(name?: string, country?: string) {

    const where: any = {};
    if(name) {
      where.customer_name = ILike(`%${name}%`);
    }

    if(country) {
      where.country = ILike(`%${country}%`);
    }

    return this.customerRepository.find({where});
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: {customer_id: id},
      relations: {orders: true}
    })
    if(!customer){
      throw new NotFoundException(`Customer ${id} not found.`);
    }
    return customer;
  }

  async update(id: number, body: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, body);
    return this.customerRepository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    return this.customerRepository.remove(customer);
  }
}
