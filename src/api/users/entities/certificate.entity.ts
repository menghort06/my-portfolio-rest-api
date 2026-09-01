import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Education } from "./education.entity";

@Entity('certificate')
export class Certificate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @ManyToOne(
        ()=> Education,
        education => education.certificates,
        { onDelete: 'CASCADE'}
    )
    @JoinColumn({name: 'education_id'})
    education: Education
}