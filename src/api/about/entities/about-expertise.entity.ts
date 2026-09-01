import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { About } from "./about.entity";

@Entity('about_expertise')
export class AboutExpertise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  icon: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(
    () => About,
    about => about.expertises,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({name: 'about_id'})
  about: About

}

/**
 * tells TypeORM: "This relationship is connected to the About entity."
 * () => About 
 * Expertise
 *   └── belongs to About
 * Without this, TypeORM wouldn't know which table/entity to connect to.
 */

/**
 * tells TypeORM: "On the About entity, the opposite side of this relationship is the expertises property."
 * about => about.expertises
 * used to defines the relationship, while relations: {expertises: true} loads the relationship only.
 */

/**
 * To automatically remove child rows when the parent is deleted:
 * {
 *  onDelete: 'CASCADE'
 * }
 */

/**
 * This tells TypeORM: Create/use a foreign key column called about_id in this table."
 * @JoinColumn({ name: 'about_id' })
 */

/**
 * This defines a property on your entity.
 * It means: "Each Expertise object has an About object."
 * about: About
 */