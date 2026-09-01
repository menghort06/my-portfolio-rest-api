import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { ProjectType } from '../project-type/entities/project-type.entity';
import { ProjectDetail } from './entities/project-detail.enitity';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail) private projectDetailRepository: Repository<ProjectDetail>,
    @InjectRepository(ProjectType) private projectTypeRepository: Repository<ProjectType>
  ) {}

  private async resolveProjectTypeId(id: number) {
    const projectType = await this.projectTypeRepository.findOne({ where: { id } });
    if (!projectType) {
      throw new NotFoundException(`Project type with id ${id} not found`);
    }
    return projectType.id;
  }

  async create(body: CreateProjectDto) {
    const projectBody = {
      ...body,
      projectDetails: await Promise.all(
        body.projectDetails.map(async (detail) => {
          const projectTypeId = await this.resolveProjectTypeId(detail.projectTypeId);
          return {
            ...detail,
            projectTypeId
          }
        })
      )
    }
    const project = this.projectRepository.create(projectBody);
    await this.projectRepository.save(project);
    return project;
  }

  async findAll() {
    const projects = await this.projectRepository.find();
    const total = projects.length;

    return {  total, data: projects };
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({ 
      where: { id }
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: number, body: UpdateProjectDto) {
    const project = await this.findOne(id);
    const { projectDetails, ...projectData } = body;

    Object.assign(project, projectData);
    let newProjectDetails: ProjectDetail[] = [];
    for (const detail of projectDetails ?? []) {
      const projectTypeId = await this.resolveProjectTypeId(detail.projectTypeId);
      if(detail.id) {
        const existingDetail = await this.projectDetailRepository.findOne({ where: { id: detail.id } });
        if(!existingDetail){
          throw new NotFoundException(`Project detail with id ${detail.id} not found`);
        }
        Object.assign(existingDetail, {...detail, projectTypeId});
        newProjectDetails.push(existingDetail);
      } else {
        const newDetail = this.projectDetailRepository.create({...detail, projectTypeId, project});
        newProjectDetails.push(newDetail);
      }
    }

    //Delete project details that are not in the new list
    await this.removeProjectDetails(project, newProjectDetails);
    project.projectDetails = newProjectDetails;
    await this.projectDetailRepository.save(newProjectDetails);
    return this.findOne(id);
  }

  private async removeProjectDetails(project, projectDetail) {
    const existingDetails = project.projectDetails || [];
    const detailsToRemove = existingDetails.filter((oldDetail) => {
      return !projectDetail.some((newDetail) => newDetail.id === oldDetail.id);
    });
    if(detailsToRemove.length > 0) {
      await this.projectDetailRepository.remove(detailsToRemove);
    }
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    return this.projectRepository.remove(project);
  }
}
