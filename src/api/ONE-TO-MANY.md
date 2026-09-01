## One to many
Let's go through One-to-Many and Many-to-One using your Customer and Order example because this is one of the most important TypeORM relationship concepts.

The real-world relationship:
    One customer can have many orders.
    One order belongs to one customer.

        Customer
            |
            | 1
            |
            |----------------<
                              |
                            Order
                            Order
                            Order
So:
Customer → Order = One-to-Many
Order → Customer = Many-to-One

## Many-to-One (Order → Customer)
/////////////////////////////////
Because many orders belong to one customer:
    @Entity('orders')
    export class Order {

        @PrimaryGeneratedColumn()
        order_id:number;

        @ManyToOne(
            ()=>Customer,
            customer=>customer.orders
        )
        @JoinColumn({
            name:'customer_id'
        })
        customer:Customer;
    }
////////////////////////////////////
"Use the customer_id column in the orders table as the foreign key."
Without it, TypeORM will create a default column name:

## One-to-Many (Customer → Orders)
Customer has many orders:
/////////////////////////
@Entity('customers')
export class Customer {

 @PrimaryGeneratedColumn()
 customer_id:number;

 @OneToMany(
   ()=>Order,
   order=>order.customer
 )
 orders:Order[];
}
//////////////////////////
## Why JoinColumn only on Many-to-One?

Because the side with the foreign key owns the relationship.
Example:
    customers

    customer_id
    ------------
    1
//////////////////////////////
    orders

    order_id | customer_id
    ----------------------
    10       | 1
    11       | 1

## Create Order
const order = this.orderRepository.create({
  ...rest,
  customer
});
    ||
    ||
const order = this.orderRepository.create({
  customer: {
    customer_id: 5,
    customer_name: "John"
  }
});
Nothing is saved yet.
create() only creates a JavaScript object.

order: {
  customer: {
    customer_id: 5,
    customer_name: "John"
  }
}

## Save Order
await orderRepository.save(order);

## Postman body 
{
  "customer_id": 2
}

But inside your backend, you convert that simple ID into the relationship object that TypeORM expects.

## DTO:
export class CreateOrderDto {
  customer_id: number;
}

At this point, you only have: body.customer_id = 2

## Service converts DTO to Entity
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => Customer)
  @JoinColumn({
    name: 'customer_id'
  })
  customer: Customer;
}

## Your entity does not have:
customer_id: number;
it has 
    customer: Customer;
So TypeORM expects:
    {
         customer: Customer
    }

## Therefore we map it
From:
    {
        "customer_id":2
    }
To: 
    const order = this.orderRepository.create({
        customer:{
            customer_id:2
        }
    });

    or 
    // Recommend
    const order = this.orderRepository.create({
        customer: customer
    });
Now TypeORM understands:
    Order
        |
        |
        customer ---> Customer id 2
And Generate SQL: 
    INSERT INTO orders(customer_id) VALUES(2);