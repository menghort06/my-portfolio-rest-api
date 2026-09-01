import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { Item } from './interface/item.interface';

@Controller()
export class ItemsController {

  constructor(
    private readonly itemService: ItemsService
  ){}

  @Get()
  findAll(): Item[] {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.itemService.findOne(id);
  }

  /**
   * @Body request body data
   * @param body
   * @returns
   */
  @Post()
  create(@Body() body: CreateItemDto) {
    return body;
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return `Delete the ${id}`;
  }

  @Put(':id')
  update(@Body() body: CreateItemDto, @Param('id') id) {
    return `Update id: ${id} body: ${JSON.stringify(body)}`;
  }
}
