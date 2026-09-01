import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Order])
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
