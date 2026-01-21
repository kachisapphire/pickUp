import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { PaystackPaymentService } from "../providers/paystack-payment.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt.guard";
import { InitiateTransactionDto } from "../dtos/initiate-transaction.dto";
import { VerifyPaymentDto } from "../dtos/verify-transaction.dto";

@Controller('payment')
@ApiBearerAuth()
@ApiTags('Payment')
@UseGuards(JwtAuthGuard)

export class PaymentController {
    constructor(
        private readonly paymentService: PaystackPaymentService
    ) { }

    @ApiOperation({
        summary: 'initiate a payment transaction',
        description: 'initiates a new payment transaction'
    })
    @ApiResponse({
        description: 'successfully initiated payment transaction',
        status: HttpStatus.OK
    })
    @Post()
    async initiateTransaction(
        @Body() dto: InitiateTransactionDto
    ) {
        return await this.paymentService.initializePayment(dto)
    }

    @ApiOperation({
        summary: 'verify a payment transaction',
        description: 'verifies a new payment transaction'
    })
    @ApiQuery({
        name: 'reference',
        description: 'the paystack transaction reference'
    })
    @ApiResponse({
        description: 'successfully verified payment transaction',
        status: HttpStatus.OK
    })
    @Get()
    async verifyPaymentTransaction(
        @Query('reference') reference: string
    ) {
        return await this.paymentService.verifyPaymentTransaction(reference)
    }
}