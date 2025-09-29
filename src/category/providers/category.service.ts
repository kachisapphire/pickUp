import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { ILike, Repository } from "typeorm";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { UpdateCategoryDto } from "../dtos/update-category.dto";
import { DeleteCategorydto } from "../dtos/delete-category.dto";

@Injectable()
export class CategoryService {
    private logger = new Logger(CategoryService.name)

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async seedCategories() {
        const categories = [
            {
                name: 'Electronics',
                description: 'Electronic devices and accessories'
            },
            {
                name: 'Fashion',
                description: 'Clothing, shoes, and accessories'
            },
            {
                name: 'Home & Kitchen',
                description: 'Furniture, appliances, and kitchenware'
            },
            {
                name: 'Health & Beauty',
                description: 'Personal care, skincare, and wellness products'
            },
            {
                name: 'Sports & Outdoors',
                description: 'Fitness gear, outdoor equipment, and activewear'
            },
            {
                name: 'Books',
                description: 'Fiction, non-fiction, and educational materials'
            },
            {
                name: 'Toys & Games',
                description: 'Toys, puzzles, and board games for all ages'
            },
            {
                name: 'Automotive',
                description: 'Car parts, accessories, and tools'
            },
            {
                name: 'Groceries',
                description: 'Everyday food, drinks, and household essentials'
            },
            {
                name: 'Office Supplies',
                description: 'Stationery, printers, and office furniture'
            },
            {
                name: 'Jewelry & Watches',
                description: 'Rings, necklaces, bracelets, and watches'
            },
            {
                name: 'Baby & Kids',
                description: 'Baby products, kids clothing, and accessories'
            },
            {
                name: 'Pet Supplies',
                description: 'Food, toys, and accessories for pets'
            },
            {
                name: 'Shoes',
                description: 'Footwear for men, women, and children'
            },
            {
                name: 'Bags & Luggage',
                description: 'Handbags, backpacks, and travel luggage'
            },
            {
                name: 'Music & Instruments',
                description: 'Musical instruments and accessories'
            },
            {
                name: 'Movies & Entertainment',
                description: 'DVDs, Blu-rays, and entertainment media'
            },
            {
                name: 'Garden & Tools',
                description: 'Gardening equipment, tools, and outdoor décor'
            },
            {
                name: 'Home Decor',
                description: 'Decorative items, lighting, and furnishings'
            },
            {
                name: 'Appliances',
                description: 'Large and small home appliances'
            }
        ];

        const savedCategories: Category[] = [];
        for (const category of categories) {
            try {
                const existingCategory = await this.categoryRepository.findOne({
                    where: { name: category.name }
                });
                if (!existingCategory) {
                    const seededCategory = this.categoryRepository.create(category);
                    const savedCategory = await this.categoryRepository.save(seededCategory);
                    savedCategories.push(savedCategory);
                }
            }
            catch (error) {
                this.logger.error(`Failed to seed category: ${category.name}`, error.stack)
            }
        }
        this.logger.log(`Successfully seeded ${savedCategories.length} category`);
        return {
            success: true,
            message: 'Category data seeded successfully',
            count: savedCategories.length
        }
    }

    async createCategory(dto: CreateCategoryDto) {
        try {
            const category = await this.categoryRepository.findOne({
                where: {
                    name: ILike(dto.name)
                }
            });
            const allCategories = await this.categoryRepository.find();
            if (category) {
                return {
                    success: false,
                    message: 'This category already exists, try a different category name',
                    categories: allCategories,
                    totalCategories: allCategories.length
                }
            }
            const newCategory = this.categoryRepository.create({
                name: dto.name,
                description: dto.description
            });
            await this.categoryRepository.save(newCategory);
            return {
                success: true,
                message: 'Successfully created category',
                newCategory
            }
        }
        catch (error) {
            this.logger.error(`Failed to create category: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error creating category'
            }
        }
    }

    async updateCategory(dto: UpdateCategoryDto) {
        try {
            const category = await this.categoryRepository.findOne({
                where: { id: dto.categoryId }
            });
            if (!category) {
                throw new NotFoundException(`category with ID ${dto.categoryId} does not exist`)
            }
            Object.assign(category, dto)
            await this.categoryRepository.save(category);
            return {
                message: 'Successfully updated category',
                success: true,
                category
            }
        }
        catch (error) {
            this.logger.error(`Failed to update category: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error updating category'
            }
        }
    }

    async deleteCategory(dto: DeleteCategorydto) {
        try {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: dto.categoryId
                }
            });
            if (!category) {
                throw new NotFoundException(`category with ID ${dto.categoryId} does not exist`)
            }
            const deletedCategory = await this.categoryRepository.remove(category);
            return {
                message: 'Successfully deleted category',
                success: true,
                deletedCategory
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete category: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error deleting category'
            }
        }
    }

    async getAllCategories() {
        try {
            const categories = await this.categoryRepository.find();
            const categoryNames = categories.map((category) => ({
                id: category.id,
                name: category.name
            }));
            return {
                success: true,
                message: 'Successfully retrieved all categories',
                categoryNames
            }
        }
        catch (error) {
            this.logger.error(`Failed to get all categories: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error retrieving categories'
            }
        }
    }

    async getCategoryById(categoryId: string) {
        try {
            const category = await this.categoryRepository.findOne({
                where: { id: categoryId }
            });
            if (!category) {
                throw new NotFoundException(`category with ID ${categoryId} does not exist`)
            }
            return {
                success: true,
                message: 'Successfully retrieved category by ID',
                category
            }
        }
        catch (error) {
            this.logger.error(`Failed to get category by ID: ${error.message}`, error.stack);
            return {
                success: false,
                message: 'Error retrieving category'
            }
        }
    }
}