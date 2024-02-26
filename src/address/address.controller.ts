import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDTO } from './dtos/createAddress.dto';
import { AddressService } from './address.service';
import { UserType } from '../user/enum/user-type.enum';
import { Roles } from '../decorators/role.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnAddressDto } from './dtos/returnAddress.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDTO,
    @UserId() userId: number,
  ) {
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Get()
  async getAddressesByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDto[]> {
    return (await this.addressService.getAddressesByUserId(userId)).map(
      (address) => new ReturnAddressDto(address),
    );
  }
}
