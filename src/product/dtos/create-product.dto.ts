import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"

export class CreateProductDto {
    @ApiProperty({
        description: 'the name of the product',
        example: 'maxi box bag'
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        description: 'the description of the product',
        example: 'maxi box bag made in'
    })
    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty({
        description: 'the price of the product',
        example: 250
    })
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty({
        type: String,
        isArray: true,
        example: ['First categoryId', 'Second categoryId'],
    })
    @IsNotEmpty()
    @IsArray()
    categoryId: string[]
}