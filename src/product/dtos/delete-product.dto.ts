import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteProductImagesDto {
    @ApiProperty({
        type: String,
        isArray: true,
        description: 'the id of the image to be deleted',
        example: ['550e8400-e29b-12d3-a456-446655440000', '550e8400-e29b-12d3-a456-446655440000']
    })
    @IsNotEmpty()
    @IsArray()
    ids: string[]
}