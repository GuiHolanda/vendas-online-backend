import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { insertCartMock } from '../__mocks__/insert-cart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { cartMock } from '../__mocks__/cart.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartMock),
            getCartByUserId: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should return returnCartDto in createCart method', async () => {
    const returnCartDto = await controller.createCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(returnCartDto).toEqual({ id: cartMock.id });
  });

  it('should return returnCartDto in getCartByUserId method with relations', async () => {
    const getCartByUserIdMethod = jest.spyOn(cartService, 'getCartByUserId');
    const returnCartDto = await controller.getCartByUserId(userEntityMock.id);

    expect(returnCartDto).toEqual({ id: cartMock.id });
    expect(getCartByUserIdMethod).toHaveBeenCalledWith(43242, true);
  });

  it('should return DeleteResult in deleteProductCart method', async () => {
    const deleteResult = await controller.deleteProductCart(
      productMock.id,
      userEntityMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return DeleteResult in clearCart method', async () => {
    const deleteResult = await controller.clearCart(userEntityMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return returnCartDTO in updateProductInCart method', async () => {
    const returnCart = await controller.updateProductInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(returnCart).toEqual({ id: cartMock.id });
  });
});
