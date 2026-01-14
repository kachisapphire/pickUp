import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator"

export class UploadImageDto {
    @ApiProperty({
        description: 'the image to be uploaded',
        format: 'binary'
    })
    @IsNotEmpty()
    image: Express.Multer.File

    @ApiProperty({
        description: 'boolean check for primary image',
        example: false
    })
    @IsOptional()
    @IsBoolean()
    isPrimary: boolean
}