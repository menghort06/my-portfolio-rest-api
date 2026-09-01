import { Category } from "src/api/categories/entities/category.entity";
import { OrderDetail } from "src/api/order/entities/order-detail.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')//Table name
export class Product {

    @PrimaryGeneratedColumn()
    product_id: number;

    @Column()
    product_name: string;

    @Column()
    unit: string;

    @Column('decimal')
    price: number;

    @Column()
    category_id: number; //used when receiving data from client

    @ManyToOne( //@ManyToOne → returns one object → category: Category
        () => Category, 
        category => category.products 	// Many products → one category
    )
    @JoinColumn({
        name: 'category_id'
    })
    category: Category;

    @OneToMany(() => OrderDetail, (detail) => detail.product)
    orderDetails: OrderDetail[];
}
