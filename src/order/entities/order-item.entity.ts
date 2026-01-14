import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entiity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Product)
    product: Product

    @ManyToOne(() => Order)
    order: Order

    @Column()
    quantity: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    orderItemPrice: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    orderItemTotalAmount: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}