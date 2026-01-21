import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'the name of the category',
    example: 'Clothing',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'the description of the category',
    example: 'Shirts.....',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
