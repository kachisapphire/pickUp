import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { In, Repository } from "typeorm";
import { Category } from "src/category/entities/category.entity";
import { CreateProductDto } from "../dtos/create-product.dto";
import { ProductImage } from "../entities/product-image.entity";
import { S3UploadService } from "src/auth/providers/s3-upload.service";
import { UploadImageDto } from "../dtos/upload-image.dto";
import { DeleteProductImagesDto } from "../dtos/delete-product.dto";

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
        private readonly s3UploadService: S3UploadService
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
            const newProduct = this.productRepository.create({
                name: dto.name,
                description: dto.description,
                price: dto.price,
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

    async uploadProductImage(productId: string, dto: UploadImageDto) {
        try {
            const product = await this.productRepository.findOne({
                where: { id: productId }
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            const imageResult = await this.s3UploadService.uploadImage(
                dto.image,
                `product-${productId}-${Date.now()}`
            );
            const imageUrl = imageResult.url;
            const imageKey = imageResult.key;
            const productImage = this.productImageRepository.create({
                imageUrl,
                imageKey,
                productId,
                isPrimary: dto.isPrimary
            });
            await this.productImageRepository.save(productImage);
            return {
                message: 'Successfully uploaded product image',
                success: true,
                productImage
            }
        }
        catch (error) {
            this.logger.error(`Failed to upload product image: ${error.message}`, error.stack);
            return {
                message: 'Error uploading product image',
                success: false
            }
        }
    }

    async getAllProducts() {
        try {
            const products = await this.productRepository.find({
                relations: ['images']
            });
            const mappedProducts = products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                images: product.images,
                createdAt: product.createdAt
            }))
            return {
                message: 'Succesfully retrieved all products',
                success: true,
                mappedProducts
            };
        }
        catch (error) {
            this.logger.error(`Failed to get all products: ${error.massage}`, error.stack);
            return {
                message: 'Error getting all products',
                success: false
            }
        }
    }

    async getProductById(id: string) {
        try {
            const product = await this.productRepository.findOne({
                where: { id }
            });
            if (!product) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            return {
                message: 'Succesfully retrieved product',
                success: true,
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    images: product.images,
                    createdAt: product.createdAt
                }
            };
        }
        catch (error) {
            this.logger.error(`Failed to get product: ${error.massage}`, error.stack);
            return {
                message: 'Error getting product',
                success: false
            }
        }
    }

    async updateProduct(id: string, dto: CreateProductDto) {
        try {
            const product = await this.productRepository.findOne({
                where: { id }
            });
            if (!product) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            Object.assign(product, dto);
            await this.productRepository.save(product);
            return {
                message: 'Successfully updated product',
                success: true,
                product
            }
        }
        catch (error) {
            this.logger.error(`Failed to update product: ${error.message}`, error.stack);
            return {
                message: 'Error updating product details',
                success: false
            }
        }
    }

    async deleteProductById(id: string) {
        try {
            const product = await this.productRepository.findOne({
                where: { id }
            });
            if (!product) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            await this.productRepository.remove(product);
            return {
                message: 'Successfully deleted product',
                success: true,
                product
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete product: ${error.message}`, error.stack);
            return {
                message: 'Error deleting product',
                success: false
            }
        }
    }

    async deleteProductImages(dto: DeleteProductImagesDto) {
        try {
            const images = await this.productImageRepository.findBy({
                id: In(dto.ids)
            });
            if (images.length === 0) {
                throw new NotFoundException('No images matches the id')
            }
            const keys = images.map((image) => image.imageKey);
            await this.s3UploadService.deleteMultipleImages(keys);
            await this.productImageRepository.remove(images);
            return {
                message: 'Successfully deleted product images',
                success: true,
                keys
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete product images: ${error.message}`, error.stack);
            throw error
        }
    }
}
