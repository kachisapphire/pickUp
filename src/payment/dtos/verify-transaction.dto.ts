import { ApiProperty } from "@nestjs/swagger";

export class VerifyPaymentDto {
    @ApiProperty({
        name: 'reference',
        example: "5gaeps2258"
    })
    reference: string
}