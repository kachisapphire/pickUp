import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../entities/order.entiity";
import { Repository } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { OrderItem } from "../entities/order-item.entity";
import { OrderStatus } from "../enums/order-status.enum";


@Injectable()
export class OrderService {
    private logger = new Logger(OrderService.name);
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>
    ) { }

    async createOrder(dto: CreateOrderDto) {
        try {
            const order = this.orderRepository.create();
            order.orderItems = await Promise.all(
                dto.orderItems.map(async (item) => {
                    const product = await this.productRepository.findOne({
                        where: { id: item.productId }
                    });
                    if (!product) {
                        throw new NotFoundException('Product does not exist');
                    }
                    const orderItem = this.orderItemRepository.create({
                        product,
                        quantity: item.quantity,
                        orderItemPrice: product.price,
                        orderItemTotalAmount: (product.price * item.quantity)
                    });

                    return orderItem
                })
            );
            order.totalAmount = this.calculateOrderTotal(order.orderItems);
            const savedOrder = await this.orderRepository.save(order)
            return {
                success: true,
                message: 'Successfully created a new order',
                savedOrder
            }
        }
        catch (error) {
            this.logger.error(`Failed to create order: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error creating an order'
            }
        }
    }

    async cancelOrder(id: string) {
        try {
            const order = await this.orderRepository.findOne({
                where: { id }
            });
            if (!order) {
                throw new NotFoundException(`order with ID ${id} does not exist`);
            }
            order.status = OrderStatus.CANCELLED;
            await this.orderRepository.save(order);
            return {
                success: true,
                message: 'Successfully cancelled order',
                order
            }
        }
        catch (error) {
            this.logger.error(`Failed to cancel order: ${error.message}`, error.stack);
            return {
                success: false,
                massage: 'Error cancelling order'
            }
        }
    }

    async removeOrderItem(id: string) {
        try {
            const orderItem = await this.orderItemRepository.findOne({
                where: { id }
            });
            if (!orderItem) {
                throw new NotFoundException(`order item with ID ${id} does not exist`)
            }
            await this.orderItemRepository.remove(orderItem);
            return {
                message: 'Successfully removed order item',
                success: true,
                orderItem
            }
        }
        catch (error) {
            this.logger.error(`Failed to remove order item: ${error.message}`, error.stack);
            return {
                message: 'Error removing order item',
                success: false
            }
        }
    }

    async addNewOrderItem(id: string, dto: CreateOrderDto) {
        try {
            const order = await this.orderRepository.findOne({
                where: { id }
            });
            if (!order) {
                throw new NotFoundException(`order item with ID ${id} does not exist`)
            }
            order.orderItems = await Promise.all(
                dto.orderItems.map(async (item) => {
                    const product = await this.productRepository.findOne({
                        where: { id: item.productId }
                    });
                    if (!product) {
                        throw new NotFoundException('Product does not exist');
                    }
                    const orderItem = this.orderItemRepository.create({
                        product,
                        quantity: item.quantity,
                        orderItemPrice: product.price,
                        orderItemTotalAmount: (product.price * item.quantity)
                    });

                    return orderItem
                })
            );
            order.totalAmount = this.calculateOrderTotal(order.orderItems);
            const savedOrder = await this.orderRepository.save(order)
            return {
                success: true,
                message: 'Successfully added a new order item',
                savedOrder
            }
        }
        catch (error) {
            this.logger.error(`Failed to add new order item: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error updating order items'
            }
        }
    }

    private calculateOrderTotal(orderItems: { orderItemTotalAmount: number }[]) {
        return orderItems.reduce((sum, orderItem) => sum + orderItem.orderItemTotalAmount, 0);
    }
}