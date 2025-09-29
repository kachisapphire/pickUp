import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Category } from "src/category/entities/category.entity";
import { ProductImage } from "./entities/product-image.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product,
            Category,
            ProductImage
        ])
    ],
    controllers: [],
    providers: []
})
export class ProductModule { }