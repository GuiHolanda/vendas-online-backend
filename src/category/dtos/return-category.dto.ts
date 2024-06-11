import { CategoryEntity } from '../entities/category.entity';

export class ReturnCategory {
  id: number;
  name: string;
  count?: number;

  constructor(categoryEntity: CategoryEntity, count?: number) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;
    this.count = count;
  }
}
