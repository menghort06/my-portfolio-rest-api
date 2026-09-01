
import { ProjectDetail } from "src/api/projects/entities/project-detail.enitity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('project_types')
export class ProjectType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(
        () => ProjectDetail,
        projectDetail => projectDetail.projectType
    )
    projectDetails: ProjectDetail[];

}
