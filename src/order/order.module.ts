import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.services';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
