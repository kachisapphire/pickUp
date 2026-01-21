import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "../enums/payment-status.enum";
import { Order } from "../../order/entities/order.entity";

@Entity()
export class PaymentTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    paymentStatus: PaymentStatus

    @Column({ type: 'integer' })
    amount: number

    @Column({
        nullable: true
    })
    userId: string

    @Column()
    transactionReference: string

    @OneToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ nullable: true })
    orderId: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}