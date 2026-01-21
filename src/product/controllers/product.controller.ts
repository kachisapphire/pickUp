import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../providers/product.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateProductDto } from '../dtos/create-product.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteProductImagesDto } from '../dtos/delete-product.dto';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product',
  })
  @ApiResponse({
    description: 'Product created successfully',
    status: 201,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create-product')
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @ApiOperation({
    summary: 'Upload product image',
    description: 'upload product image',
  })
  @ApiParam({
    name: 'productId',
    description: 'the product ID',
  })
  @ApiBody({
    description: 'Upload product image',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        isPrimary: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @ApiResponse({
    description: 'Successfully uploaded images',
    status: 201,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('upload-image/:productId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: UploadImageDto,
  ) {
    return await this.productService.uploadProductImage(productId, {
      image,
      isPrimary: dto.isPrimary,
    });
  }

  @ApiOperation({
    summary: 'Get all products',
    description: 'get all products',
  })
  @ApiResponse({
    description: 'products retrieved successfully',
    status: 200,
  })
  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @ApiOperation({
    summary: 'Get product by id',
    description: 'get product by Id',
  })
  @ApiParam({
    name: 'productId',
    description: 'the product Id',
  })
  @ApiResponse({
    description: 'Successfully retrieved product by Id',
    status: 200,
  })
  @Get(':productId')
  async getProductById(@Param('productId') productId: string) {
    return await this.productService.getProductById(productId);
  }

  @ApiOperation({
    summary: 'Update product by Id',
    description: 'update product by Id',
  })
  @ApiParam({
    name: 'productId',
    description: 'the product Id',
  })
  @ApiResponse({
    description: 'Product updated successfully',
    status: 201,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('update-product/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() dto: CreateProductDto,
  ) {
    return await this.productService.updateProduct(productId, dto);
  }

  @ApiOperation({
    summary: 'delete product by Id',
    description: 'delete product by Id',
  })
  @ApiParam({
    name: 'productId',
    description: 'the product Id',
  })
  @ApiResponse({
    description: 'Product deleted successfully',
    status: 201,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete-product/:productId')
  async deleteProduct(@Param('productId') productId: string) {
    return await this.productService.deleteProductById(productId);
  }

  @ApiOperation({
    summary: 'Delete multiple product images',
    description: 'delete multiple product image',
  })
  @ApiResponse({
    description: 'Successfully deleted product images',
    status: 201,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('product-images')
  async deleteProductImages(@Body() dto: DeleteProductImagesDto) {
    return await this.productService.deleteProductImages(dto);
  }
}
