import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { OrderService } from '../services/order.services';
import { CreateOrderDto } from '../dtos/create-order.dto';

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @ApiOperation({
    summary: 'Create a new order',
    description: 'create a new order',
  })
  @ApiResponse({
    description: 'Successfully created a new order',
    status: 201,
  })
  @Post('create-order')
  async createOrder(
    @Req() req,
    @Body() dto: CreateOrderDto) {
    return await this.orderService.createOrder(req.user.userId, dto);
  }
}
