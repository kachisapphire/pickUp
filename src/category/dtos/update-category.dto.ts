import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends CreateCategoryDto {
  @ApiProperty({
    description: 'the category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId: string;
}
