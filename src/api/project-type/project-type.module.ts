import { Module } from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';
import { ProjectTypeController } from './project-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './entities/project-type.entity';
import { ProjectDetail } from '../projects/entities/project-detail.enitity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectType, ProjectDetail, Project])
  ],
  controllers: [ProjectTypeController],
  providers: [ProjectTypeService],
})
export class ProjectTypeModule {}
