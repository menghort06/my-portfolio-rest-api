import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('home') //table name
export class Home {

    @PrimaryGeneratedColumn({name: 'home_id'})
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;
    

}
