import { text } from "stream/consumers";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AboutExpertise } from "./about-expertise.entity";

@Entity('abouts') //table name
export class About {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    subtitle: string;

    @Column({name: 'short_description', type: 'text', nullable: true})
    shortDescription: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @OneToMany(
        () => AboutExpertise,
        expertises => expertises.about,
        { cascade: true}
    )
    expertises: AboutExpertise[]
}

/**
 * 1. What does cascade: true do?
 * It means:
 * When I save/update/remove the parent (About), TypeORM should automatically apply operations to the child entities (AboutExpertise).
 */


