import { User } from "src/api/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('addresses') //Table name
export class Address {
    @PrimaryGeneratedColumn()
    address_id: number;

    @Column()
    village: string;

    @Column()
    district: string;

    @Column()
    commune: string;

    @Column()
    province: string;

    @OneToOne(
        () => User,
        user => user.address,
        {
            onDelete: 'CASCADE'
        }
    )
    user: User
}
