## The Core Relationship Chain Order (1) ──────> (M) OrderDetail (M) ──────> (1) Product

## 1. The Three Entities (Simplified)

# Product Entity - The item being sold
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "src/api/order/entities/order-detail.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column()
    product_name: string;

    @Column()
    unit: string;  // e.g., 'kg', 'piece', 'liter'

    @Column('decimal')
    price: number;

    // One product can appear in many order details
    @OneToMany(() => OrderDetail, (detail) => detail.product)
    orderDetails: OrderDetail[];
}

# Order Entity - The customer's purchase order
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetail } from "src/api/order/entities/order-detail.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column()
    customer_id: number;  // Who placed the order

    @CreateDateColumn()
    order_date: Date;  // When it was placed

    // One order has many order details
    @OneToMany(() => OrderDetail, (detail) => detail.order)
    orderDetails: OrderDetail[];
}

# OrderDetail Entity - The link/join table
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "src/api/order/entities/order.entity";
import { Product } from "src/api/products/entities/product.entity";

@Entity('order_details')
export class OrderDetail {
    @PrimaryGeneratedColumn()
    order_detail_id: number;

    @Column()
    order_id: number;  // Foreign key to Order

    @Column()
    product_id: number;  // Foreign key to Product

    @Column()
    quantity: number;  // How many of this product

    // Many-to-One with Order
    @ManyToOne(() => Order, (order) => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    // Many-to-One with Product
    @ManyToOne(() => Product, (product) => product.orderDetails)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}

## 2. Database Schema
-- Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order details table (Junction/JOIN table)
CREATE TABLE order_details (
    order_detail_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    -- Prevents duplicate product in same order
    UNIQUE(order_id, product_id)
);

##  3. DTOs for Creating Orders
# CreateOrderDetailDto - One line item
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateOrderDetailDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}

# CreateOrderDto - Full order with items
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "./create-order-detail.dto";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    customer_id: number;

    @ValidateNested({ each: true })  // 🔥 Validate each item in array
    @Type(() => CreateOrderDetailDto)
    orderDetails: CreateOrderDetailDto[];
}

##  4. Complete Flow: Creating an Order
# Client Request
POST /orders
{
    "customer_id": 5,
    "orderDetails": [
        {
            "product_id": 101,
            "quantity": 2
        },
        {
            "product_id": 105,
            "quantity": 1
        },
        {
            "product_id": 108,
            "quantity": 3
        }
    ]
}
# Service - Multiple Approaches
# Approach 1: With Cascade Enabled (Cleanest)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async create(createOrderDto: CreateOrderDto) {
        // Create order with nested order details
        const order = this.orderRepository.create({
            customer_id: createOrderDto.customer_id,
            orderDetails: createOrderDto.orderDetails.map(detail => ({
                product_id: detail.product_id,
                quantity: detail.quantity
            }))
        });

        // Save with cascade
        return this.orderRepository.save(order);
    }
}

# Prerequisite: Add cascade: true in Order entity:
@OneToMany(() => OrderDetail, (detail) => detail.order, {
    cascade: true  // 👈 Allows auto-saving of order details
})
orderDetails: OrderDetail[];

# Approach 2: Manual Mapping (Explicit Control)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async create(createOrderDto: CreateOrderDto) {
        // 1. Create the order
        const order = this.orderRepository.create({
            customer_id: createOrderDto.customer_id
        });
        
        // 2. Save order first to get order_id
        const savedOrder = await this.orderRepository.save(order);
        
        // 3. Create order details
        const orderDetails = [];
        for (const detailDto of createOrderDto.orderDetails) {
            // Optional: Verify product exists
            const product = await this.productRepository.findOne({
                where: { product_id: detailDto.product_id }
            });
            
            if (!product) {
                throw new NotFoundException(
                    `Product ${detailDto.product_id} not found`
                );
            }
            
            const detail = this.orderDetailRepository.create({
                order_id: savedOrder.order_id,
                product_id: detailDto.product_id,
                quantity: detailDto.quantity
            });
            
            orderDetails.push(detail);
        }
        
        // 4. Save all order details
        await this.orderDetailRepository.save(orderDetails);
        
        // 5. Return the complete order with details
        return this.orderRepository.findOne({
            where: { order_id: savedOrder.order_id },
            relations: ['orderDetails', 'orderDetails.product']
        });
    }
}

# Approach 3: Using QueryBuilder (Advanced)
async create(createOrderDto: CreateOrderDto) {
    return this.orderRepository.manager.transaction(async (transactionalEntityManager) => {
        // 1. Create order
        const order = new Order();
        order.customer_id = createOrderDto.customer_id;
        const savedOrder = await transactionalEntityManager.save(order);
        
        // 2. Create all order details in one batch
        const orderDetails = createOrderDto.orderDetails.map(dto => {
            const detail = new OrderDetail();
            detail.order_id = savedOrder.order_id;
            detail.product_id = dto.product_id;
            detail.quantity = dto.quantity;
            return detail;
        });
        
        await transactionalEntityManager.save(OrderDetail, orderDetails);
        
        // 3. Return complete order
        return transactionalEntityManager.findOne(Order, {
            where: { order_id: savedOrder.order_id },
            relations: ['orderDetails', 'orderDetails.product']
        });
    });
}