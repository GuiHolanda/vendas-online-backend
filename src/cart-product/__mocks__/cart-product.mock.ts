import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { CartProductEntity } from '../entities/cart-product.entity';

export const cartProductMock: CartProductEntity = {
  amount: 32,
  cartId: cartMock.id,
  id: 12,
  createdAt: new Date(),
  productId: productMock.id,
  updatedAt: new Date(),
};
