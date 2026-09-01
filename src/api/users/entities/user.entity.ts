import { Address } from "src/api/users/entities/address.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Education } from "./education.entity";
import { Skill } from "src/api/skill/entities/skill.entity";

@Entity('users')  // IMPORTANT: table name from the PostgreSQL
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;
    
    @Column()
    title: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @Column() 
    username: string;

    @Column()
    password: string;

    @Column() 
    gender: string;

    @Column({name: 'date_of_birth'})
    dateOfBirth: Date;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({name: 'marital_status'})
    maritalStatus: string;

    @Column()
    nationality: string;

   @Column({ name: 'photo_url', nullable: true })
    photoUrl: string;
    
    @Column()
    address_id: number;

    @OneToOne(
        () => Address,
        address => address.user,
        {cascade: true}
    )
    @JoinColumn({name: 'address_id'})
    address: Address

    @OneToMany(
        ()=> Education,
        eduction => eduction.user,
        {
            cascade: true
        }
    )
    educations: Education[]

    @ManyToMany(
        () => Skill,
        skill => skill.users, 
        {cascade: true}
    )
    @JoinTable({
        name: 'user_skills',
        joinColumn: { name: 'userId', referencedColumnName: 'user_id'},
        inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id'}
    })
    skills: Skill[]
}
