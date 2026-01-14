import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Category } from "src/category/entities/category.entity";
import { ProductImage } from "./entities/product-image.entity";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./providers/product.service";
import { S3UploadService } from "src/auth/providers/s3-upload.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product,
            Category,
            ProductImage
        ])
    ],
    controllers: [ProductController],
    providers: [ProductService,
        S3UploadService
    ]
})
export class ProductModule { }