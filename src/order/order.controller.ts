import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id.decorator';
import { Roles } from '../decorators/role.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { OrderEntity } from './entities/order.entity';
@Roles(UserType.Admin, UserType.User)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDto: CreateOrderDTO,
    @UserId() userId: number,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  async getAllOrdersByUserId(@UserId() userId: number): Promise<OrderEntity[]> {
    return this.orderService.getAllOrdersByUserId(userId);
  }
}
