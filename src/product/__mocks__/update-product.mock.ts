import { categoryMock } from '../../category/__mocks__/category.mock';
import { CreateProductDTO } from '../dtos/create-product.dto';

export const updateProductMock: CreateProductDTO = {
  categoryId: categoryMock.id,
  image: 'updated image',
  name: 'new name for update product',
  price: 55.0,
};
