import { Controller, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/order/entities/order.entity";
import { PaymentTransaction } from "./entities/payment-transaction.entity";
import { PaystackPaymentService } from "./providers/paystack-payment.service";
import { PaymentController } from "./controllers/payment.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            PaymentTransaction
        ])
    ],
    controllers: [PaymentController],
    providers: [PaystackPaymentService]
})

export class PaymentModule { }