import { Product } from "src/api/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories') //Entity table name
export class Category {
    
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column()
    category_name: string;

    @Column()
    description: string;
    
    @OneToMany( //@OneToMany → returns an array → products: Product[]
    () => Product,
        product => product.category //"Inside the Product class, the property that represents this relationship is named category. 	One category → many products"
    )
    products: Product[];

}
