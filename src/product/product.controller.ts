import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/return-product.dto';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAll()).map(
      (product) => new ReturnProductDTO(product),
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() newProduct: CreateProductDTO,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(newProduct);
  }
}
