import { ReturnCategory } from '../../category/dtos/return-category.dto';
import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDTO {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: ReturnCategory;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.category = productEntity.category
      ? new ReturnCategory(productEntity.category)
      : undefined;
  }
}
