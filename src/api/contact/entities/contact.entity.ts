import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContactDetail } from "./contact-detail.entity";

@Entity('contact')
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;

    @Column({name: 'short_description'})
    shortDescription: string;

    @Column()
    description: string;

    @OneToMany(
        () => ContactDetail,
        detail => detail.contact,
        {cascade: true}
    )
    details: ContactDetail[]

}
