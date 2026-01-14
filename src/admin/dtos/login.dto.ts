import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class AdminLoginDto {
    @ApiProperty({
        description: 'the users email address',
        example: 'user@email.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'the user password',
        example: 'password123'
    })
    password: string
}