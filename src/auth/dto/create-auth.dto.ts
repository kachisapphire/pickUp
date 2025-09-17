import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../enum/user-role.enum"
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
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

    @ApiProperty({
        description: 'the users password',
        example: 'password1233'
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        description: 'the users role',
        enum: UserRole,
        example: UserRole.USER
    })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole
}