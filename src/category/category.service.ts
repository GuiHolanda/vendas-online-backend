import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categoryList = await this.categoryRepository.find();

    if (!categoryList || categoryList.length === 0) {
      throw new NotFoundException('No categories were found.');
    }

    return categoryList;
  }

  async getCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { name } });

    if (!category) {
      throw new NotFoundException(`Category ${name} not found`);
    }

    return category;
  }

  async createCategory(
    createCategory: CreateCategory,
  ): Promise<CategoryEntity> {
    const category = await this.getCategoryByName(createCategory.name).catch(
      () => undefined,
    );

    if (category) {
      throw new BadRequestException(
        `category ${category.name} was already created`,
      );
    }

    return this.categoryRepository.save(createCategory);
  }
}
