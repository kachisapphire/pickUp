import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "../providers/category.service";
import { CreateCategoryDto } from "../dtos/create-category.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateCategoryDto } from "../dtos/update-category.dto";
import { DeleteCategorydto } from "../dtos/delete-category.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/role.decorator";
import { UserRole } from "src/auth/enum/user-role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@ApiTags('Category')
@Controller('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @ApiOperation({
        summary: 'create a new category',
        description: 'create a new category'
    })
    @ApiResponse({
        description: 'category created successfully',
        status: 201
    })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('create-category')
    async createCategory(
        @Body() dto: CreateCategoryDto
    ) {
        return await this.categoryService.createCategory(dto)
    }

    @ApiOperation({
        summary: 'updates a category',
        description: 'updates a category'
    })
    @ApiResponse({
        description: 'category updated successfully',
        status: 201
    })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch('update-category')
    async updateCategory(
        @Body() dto: UpdateCategoryDto
    ) {
        return await this.categoryService.updateCategory(dto)
    }

    @ApiOperation({
        summary: 'get all categories',
        description: 'get all categories'
    })
    @ApiResponse({
        description: 'successfully fetched all categories',
        status: 200
    })
    @Get()
    async getAllCategories() {
        return await this.categoryService.getAllCategories()
    }

    @ApiOperation({
        summary: 'get category by Id',
        description: 'get category by Id'
    })
    @ApiParam({
        name: 'categoryId',
        description: 'the category Id'
    })
    @ApiResponse({
        description: 'successfully retrieved category',
        status: 200
    })
    @Get(':categoryId')
    async getCategoryById(
        @Param('categoryId') categoryId: string
    ) {
        return await this.categoryService.getCategoryById(categoryId)
    }

    @ApiOperation({
        summary: 'deletes a category',
        description: 'deletes a category'
    })
    @ApiResponse({
        description: 'category deleted successfully',
        status: 201
    })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete('delete-category')
    async deleteCategory(
        @Body() dto: DeleteCategorydto
    ) {
        return await this.categoryService.deleteCategory(dto)
    }

    @ApiOperation({
        summary: 'seed initial category data',
        description: 'seed initial category data'
    })
    @ApiResponse({
        description: 'category seeded successfully',
        status: 201
    })
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('seed')
    async seedCategory() {
        return await this.categoryService.seedCategories()
    }
}