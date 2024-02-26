import { Controller, Get } from '@nestjs/common';
import { ReturnCategory } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from 'src/user/enum/user-type.enum';

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
}
