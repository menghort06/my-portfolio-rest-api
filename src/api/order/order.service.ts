import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>

  ) {}

  private async getCustomerById(customer_id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id }
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer ${customer_id} not found`
      );
    }
    return customer;
  }

  //@OneToMany(() => OrderDetail, (detail) => detail.order, {
    //     cascade: true  // 👈 Allows auto-saving of order details
    // })
  // orderDetails: OrderDetail[];
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


  // async create(body: CreateOrderDto) {
  //   const { customer_id, products, ...rest } = body;
  //   // Get Customer by ID
  //   const customer = await this.getCustomerById(customer_id);

  //   //Create Order 
  //   const order = this.orderRepository.create({ ...rest, customer });
  //   const saveOrder = await this.orderRepository.save(order);

  //   // Create Order Details
  //   const detail = products.map((item) => {
  //     return this.orderDetailRepository.create({
  //       order: saveOrder,
  //       product: {
  //         product_id: item.product_id
  //       },
  //       quantity: item.quantity
  //     })
  //   });
  //   await this.orderDetailRepository.save(detail);

  //   return this.findOne(saveOrder.order_id);
  // }

  async findAll() {
    const orders = await this.orderRepository.find();
    return orders
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: { 
        customer: true, 
        orderDetails: {
          product: true
        } 
    }
    });
    if(!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async update(id: number, body: UpdateOrderDto) {
    const order = await this.findOne(id);
    
    //Update Customer if customer_id is changed
    let customer = order.customer;
    if(body.customer_id) {
      customer = await this.getCustomerById(body.customer_id);
    }

    // Update Order
    Object.assign(order, {...body, customer});
    const saveOrder = await this.orderRepository.save(order);

    // Update Order Details
    if(body.orderDetails) {
      // Get ids send from frontend
      const incomingIds = body.orderDetails.map(order => order.order_detail_id);


      for(const item of body.orderDetails) {
        //existing order detail
        if(item.order_detail_id) {
          await this.orderDetailRepository.update(
            item.order_detail_id,
            {
              product: {
                product_id: item.product_id
              },
              quantity: item.quantity
            }
          )
        }
        // New order details
        else {
          const detail = this.orderDetailRepository.create({
            order: saveOrder,
            product: {
              product_id: item.product_id
            },
            quantity: item.quantity
          });
          await this.orderDetailRepository.save(detail);
        }
      }
    } 

    return this.findOne(saveOrder.order_id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepository.remove(order);
  }

}

