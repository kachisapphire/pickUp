import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entiity";
import { OrderItem } from "./entities/order-item.entity";
import { Product } from "src/product/entities/product.entity";
import { OrderController } from "./controllers/order.controller";
import { OrderService } from "./services/order.services";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            OrderItem,
            Product
        ])
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule { }