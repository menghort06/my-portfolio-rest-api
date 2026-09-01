import { Customer } from "src/api/customers/entities/customer.entity";
import { OrderDetail } from "src/api/order/entities/order-detail.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('orders') //Entity table name
export class Order {

    @PrimaryGeneratedColumn()
    order_id: number;

    @Column()
    customer_id: number;

    @CreateDateColumn()
    order_date: Date;

    @ManyToOne(() => Customer, customer => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(
        () => OrderDetail, 
        (detail) => detail.order,
        {
            cascade: true, // Enable cascading for related entities
        }
    )
    orderDetails: OrderDetail[];
}