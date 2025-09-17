import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class VerifyEmailDto {
    @ApiProperty({
        description: 'the users email address',
        example: 'user@email.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'the verification code',
        example: '123456'
    })
    @IsString()
    @IsNotEmpty()
    code: string
}