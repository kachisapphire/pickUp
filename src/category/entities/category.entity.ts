import { Product } from "../../product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    name: string

    @Column({ nullable: true })
    description: string

    @ManyToMany(() => Product, (product) => product.category,
        {
            cascade: true,
            nullable: true
        })
    product: Product

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}