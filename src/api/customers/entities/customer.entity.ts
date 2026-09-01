import { Order } from "src/api/order/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('customers') // Table name
export class Customer {

    @PrimaryGeneratedColumn()
    customer_id: number;

    @Column()
    customer_name: string;

    @Column()
    contact_name: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    postal_code: string;

    @Column()
    country: string;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];
}
