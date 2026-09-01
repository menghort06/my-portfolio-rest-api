import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';

@Controller()
export class ProjectTypeController {
  constructor(private readonly projectTypeService: ProjectTypeService) {}

  @Post()
  create(@Body() body: CreateProjectTypeDto) {
    return this.projectTypeService.create(body);
  }

  @Get()
  findAll() {
    return this.projectTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectTypeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateProjectTypeDto) {
    return this.projectTypeService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectTypeService.remove(+id);
  }
}
