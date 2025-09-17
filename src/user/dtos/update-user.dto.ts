import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UpdateUserDto {
    @ApiProperty({
        description: 'the users first name',
        example: 'John'
    })
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiProperty({
        description: 'the users last name',
        example: 'Doe'
    })
    @IsString()
    @IsNotEmpty()
    lastName: string

    @ApiProperty({
        description: 'the users email address',
        example: 'user@email.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'the users phone number',
        example: '07056431467'
    })
    @IsString()
    @IsNotEmpty()
    phone: string
}