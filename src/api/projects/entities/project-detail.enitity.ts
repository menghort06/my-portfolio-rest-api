import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project.entity";
import { ProjectType } from "src/api/project-type/entities/project-type.entity";

@Entity('project_details')
export class ProjectDetail {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    subtitle: string;

    @Column()
    year: number;

    @Column()
    description: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(
        () => Project,
        project => project.projectDetails,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({name: 'project_id'})
    project: Project;
    
    // this the relationship between project detail and project type, each project detail has one project type
    @Column({name: 'project_type_id'})
    projectTypeId: number;
    
    @ManyToOne(
        () => ProjectType,
        projectType => projectType.projectDetails,
        { eager: true }
    )
    @JoinColumn({name: 'project_type_id'})
    projectType: ProjectType;
}