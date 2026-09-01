import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectType } from '../project-type/entities/project-type.entity';
import { ProjectDetail } from './entities/project-detail.enitity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectType,
      ProjectDetail
    ])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
