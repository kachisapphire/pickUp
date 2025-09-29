import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { In, Repository } from "typeorm";
import { Category } from "src/category/entities/category.entity";
import { CreateProductDto } from "../dtos/create-product.dto";
import { ProductImage } from "../entities/product-image.entity";

@Injectable()
export class ProductService {
    private logger = new Logger(ProductService.name);
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
    ) { }

    async createProduct(dto: CreateProductDto) {
        try {
            const product = await this.productRepository.findOne({
                where: { name: dto.name }
            });
            if (product) {
                return {
                    message: 'this product already exists',
                    success: false,
                    product
                }
            }
            const categories = await this.categoryRepository.find({
                where: { id: In(dto.categoryId) }
            });
            const images = dto.image.map((image) =>
                this.productImageRepository.create({
                    imageUrl: image.image,
                    isPrimary: image.isPrimary
                }))
            const newProduct = this.productRepository.create({
                name: dto.name,
                description: dto.description,
                price: dto.price,
                images: images,
                category: categories,
            });
            await this.productRepository.save(newProduct);
            return {
                message: 'Successfully created product',
                success: true,
                newProduct
            }
        }
        catch (error) {
            this.logger.error(`Failed to create product: ${error.message}`, error.stack);
            return {
                message: 'Error creating product',
                success: false,
            }
        }
    }


}