import { Order } from "src/api/order/entities/order.entity";
import { Product } from "src/api/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_details') //table name
export class OrderDetail {
    @PrimaryGeneratedColumn()
    order_detail_id: number;

    @Column()
    order_id: number;

    @Column()
    product_id: number;

    @Column()
    quantity: number;

    // Many-to-One with Order
    @ManyToOne(() => Order, (order) => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    // Many-to-One with Product
    @ManyToOne(() => Product, (product) => product.orderDetails)
    @JoinColumn({name: 'product_id'})
    product: Product;

}
