import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contact } from "./contact.entity";

@Entity('contact_detail')
export class ContactDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    icon: string;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    link: String;

    @Column()
    description: string;

    @ManyToOne(
        () => Contact,
        contact => contact.details,
        {
          onDelete: 'CASCADE'
        }
    )
    @JoinColumn({name: 'contact_id'})
    contact: Contact
}