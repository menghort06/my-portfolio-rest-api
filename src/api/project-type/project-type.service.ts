import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectType } from './entities/project-type.entity';

@Injectable()
export class ProjectTypeService {

  constructor(
    @InjectRepository(ProjectType)
    private readonly projectTypeService: Repository<ProjectType>
  ){}

  async  create(body: CreateProjectTypeDto) {
    const projectType = this.projectTypeService.create(body);
    return await this.projectTypeService.save(projectType);
  }

  async findAll() {
    const projectTypes = await this.projectTypeService.find({
      relations: {
        projectDetails: true
      }
    });
    const total = projectTypes.length;
    return {data: projectTypes, total}
  }

  async findOne(id: number) {
    const projectType = await this.projectTypeService.findOne({
    where: {id: id}
    });
    if(!projectType) {
      throw new NotFoundException(`Project Type ${id} not found.`);
    }
    return projectType;
  }

  async update(id: number, body: UpdateProjectTypeDto) {
    const projectType = await this.findOne(id);
    Object.assign(projectType, body);
    return await this.projectTypeService.save(projectType);
  }

  async remove(id: number) {
    const projectType = await this.findOne(id);
    return this.projectTypeService.remove(projectType);
  }
}
