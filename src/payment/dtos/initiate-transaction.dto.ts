import { ApiProperty } from "@nestjs/swagger";

export class InitiateTransactionDto {
    @ApiProperty({
        name: 'orderId',
        example: '59f98c94-b358-48f4-906b-3aa0c0b26681'
    })
    orderId: string
}