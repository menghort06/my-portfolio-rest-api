import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProjectDetail } from "./project-detail.enitity";

@Entity('projects')
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(
        () => ProjectDetail,
        projectDetail => projectDetail.project,
        {
            cascade: true,
            eager: true
        }
    )
    projectDetails: ProjectDetail[];

}
