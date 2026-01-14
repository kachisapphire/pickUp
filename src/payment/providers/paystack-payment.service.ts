import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaystackPaymentService {
    private readonly secretKey: string
    private readonly logger = new Logger(PaystackPaymentService.name);

    constructor(
        private readonly configService: ConfigService
    ) {
        this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
        if (!this.secretKey) {
            this.logger.error('PAYSTACK_SECRET_KEY is not configured in environmental variables')
        }
    }

    async initializePayment() {

    }
}