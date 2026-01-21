import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'the users email address',
    example: 'user@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'the users password',
    example: 'password1233',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
