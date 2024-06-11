import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';
import { ProductService } from '../product/product.service';
import { CategoryTotals } from '../product/dtos/returnCountProductsByCategoryId.dto';
import { ReturnCategory } from './dtos/return-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  findCountByCategoryId(
    categoryTotals: CategoryTotals[],
    categoryId: number,
  ): number {
    const categoryCount = categoryTotals.find(
      (category) => category.category_id === categoryId,
    );

    if (categoryCount) {
      return categoryCount.count;
    }

    return 0;
  }

  async getAllCategories(): Promise<ReturnCategory[]> {
    const categoryList = await this.categoryRepository.find();

    const categoryTotals =
      await this.productService.countProductsByCategoryId();

    if (!categoryList || categoryList.length === 0) {
      throw new NotFoundException('No categories were found.');
    }

    return categoryList.map(
      (category) =>
        new ReturnCategory(
          category,
          this.findCountByCategoryId(categoryTotals, category.id),
        ),
    );
  }

  async getCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category id: ${id} not found`);
    }

    return category;
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
