import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReturnCategory } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { CreateCategory } from './dtos/create-category.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<ReturnCategory[]> {
    return (await this.categoryService.getAllCategories()).map(
      (category) => new ReturnCategory(category),
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategory,
  ): Promise<CreateCategory> {
    return this.categoryService.createCategory(createCategory);
  }
}
