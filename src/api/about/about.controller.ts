import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

@Controller()
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  create(@Body() body: CreateAboutDto) {
    return this.aboutService.create(body);
  }

  @Get()
  findAll() {
    return this.aboutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboutService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateAboutDto) {
    return this.aboutService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aboutService.remove(+id);
  }
}
