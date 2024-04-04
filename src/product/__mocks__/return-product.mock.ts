import { ReturnProductDTO } from '../dtos/return-product.dto';
import { productMock } from './product.mock';

export const returnProductMock: ReturnProductDTO = {
  id: productMock.id,
  image: productMock.image,
  name: productMock.name,
  price: productMock.price,
};
