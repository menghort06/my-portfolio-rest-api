import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Certificate } from "./certificate.entity";

@Entity('education')
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    degree: string;

    @Column()
    school: string;

    @Column()
    period: string;

    @Column()
    url: string;

    @Column()
    description: string;

    @ManyToOne(
        ()=> User,
        user => user.educations,
        {
            'onDelete': 'CASCADE'
        }
    )
    @JoinColumn({name: 'user_id'})
    user: User;

    @OneToMany(
        ()=> Certificate,
        certificate => certificate.education,
        {cascade: true}
    )
    certificates: Certificate[]
}