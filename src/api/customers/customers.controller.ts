import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() body: CreateCustomerDto) {
    return this.customersService.create(body);
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('country') country?: string
  ) {
    return this.customersService.findAll(name, country);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
    return this.customersService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
