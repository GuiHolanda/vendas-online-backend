import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { CategoryTotals } from './dtos/returnCountProductsByCategoryId.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(
    productIdList?: number[],
    withRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productIdList && productIdList.length > 0) {
      findOptions = {
        where: { id: In(productIdList) },
      };
    }

    if (withRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }
    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('No products found');
    }

    return products;
  }

  async getProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`No product found with id: ${productId}`);
    }

    return product;
  }

  async createProduct(product: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.getCategoryById(product.categoryId);

    return this.productRepository.save(product);
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.getProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: UpdateProductDTO,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.getProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async countProductsByCategoryId(): Promise<CategoryTotals[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as count')
      .groupBy('product.category_id')
      .getRawMany();
  }
}
