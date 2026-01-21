import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitiateTransactionDto } from '../dtos/initiate-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../order/entities/order.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { VerifyPaymentDto } from '../dtos/verify-transaction.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrderStatus } from 'src/order/enums/order-status.enum';

@Injectable()
export class PaystackPaymentService {
  private readonly secretKey: string;
  private readonly baseUrl: string;
  private readonly logger = new Logger(PaystackPaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepository: Repository<PaymentTransaction>
  ) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASE_URL');
    if (!this.secretKey || this.baseUrl) {
      this.logger.error(
        'environmental variables not configured',
      );
    }

  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-type': 'application/json'
    }
  }

  async initializePayment(dto: InitiateTransactionDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: dto.orderId },
        relations: ['user']
      });
      if (!order) {
        throw new NotFoundException('Order not found or has been deleted')
      }
      const email = order.user.email;
      const amountFromDb = order.totalAmount;
      console.log(`Amount from db: ${amountFromDb}`);
      const amount = Math.round(Number(order.totalAmount) * 100);
      console.log(amount)
      const metadata = {
        userId: order.user.id,
        orderId: order.id
      }
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount,
          email,
          metadata,
        },
        { headers: this.headers }
      );
      const result = response.data;
      const data = result.data;
      if (result.status === true) {
        const transaction = this.paymentTransactionRepository.create({
          transactionReference: data.reference,
          amount: Math.round(amount / 100),
          userId: order.user.id,
          orderId: order.id
        });
        await this.paymentTransactionRepository.save(transaction);
      }
      return {
        message: 'transaction initiated successfully',
        success: true,
        data
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to initiate transaction: ${error.message}`, error.stack);
        return {
          success: false,
          message: 'Error initiating transaction'
        }
      }
    }
  }

  async verifyPaymentTransaction(reference: string) {
    try {
      const transaction = await this.paymentTransactionRepository.findOne({
        where: { transactionReference: reference },
        relations: ['order']
      });
      if (!transaction) {
        return null
      }
      const order = await this.orderRepository.findOne({
        where: { id: transaction.orderId }
      });
      if (!order) {
        throw new NotFoundException('order not found or has been deleted')
      }
      const paymentReference = transaction.transactionReference;
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${paymentReference}`,
        { headers: this.headers }
      )
      if (!response) {
        return null
      }
      const result = response.data;
      const transactionStatus = result.data.status;
      if (transactionStatus === "success") {
        transaction.paymentStatus = PaymentStatus.SUCCESSFUL
        order.status = OrderStatus.PAID;
        await this.orderRepository.save(order);
      }
      else {
        transaction.paymentStatus = PaymentStatus.FAILED
      }
      await this.paymentTransactionRepository.save(transaction);
      return {
        success: true,
        message: 'successfully verified payment',
        transaction,
        order
      }
    }
    catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to verify payment transaction: ${error.message}`, error.stack);
        return {
          success: false,
          message: 'Error verifying payment transaction'
        }
      }
    }
  }
}
