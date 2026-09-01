import { User } from "src/api/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    icon: string;

    @Column({name: 'created_at'})
    createdAt: Date;

    @Column()
    description: string;

    @ManyToMany(
        ()=> User,
        user => user.skills
    )
    users: User[]
}
