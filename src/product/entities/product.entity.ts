import { Category } from "../../category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
    price: number

    @Column()
    quantity: number

    @Column({ default: true })
    isAvailable: boolean

    @ManyToMany(() => Category, (category) => category.product,
        {
            nullable: false
        })
    @JoinTable()
    category: Category[]

    @OneToMany(
        () => ProductImage, (images) => images.product,
        {
            cascade: true
        }
    )
    images: ProductImage[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

}