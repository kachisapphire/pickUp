import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UploadImageDto {
    @ApiProperty({
        description: 'the ',
        example: ''
    })
    @IsNotEmpty()
    @IsString()
    image: string

    @ApiProperty({
        description: 'boolean check for primary image',
        example: false
    })
    @IsOptional()
    @IsBoolean()
    isPrimary: boolean
}