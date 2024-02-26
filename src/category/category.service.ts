import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

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
}
