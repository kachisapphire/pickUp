import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    orderNumber: string

    @OneToMany(() => OrderItem, orderItem => orderItem.order,
        {
            cascade: true
        })
    orderItems: OrderItem[]

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PAYMENT_PENDING,
    })
    status: OrderStatus

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}