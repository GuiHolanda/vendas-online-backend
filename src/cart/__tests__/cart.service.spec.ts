import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { NotFoundException } from '@nestjs/common';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { cartMock } from '../__mocks__/cart.mock';
import { insertCartMock } from '../__mocks__/insert-cart.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(cartMock),
            findOne: jest.fn().mockResolvedValue(cartMock),
          },
        },
        {
          provide: CartProductService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(undefined),
            updateProductInCart: jest.fn().mockResolvedValue(undefined),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartProductService = module.get(CartProductService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
    expect(cartProductService).toBeDefined();
  });

  it('should return delete result when clearCart method succeeds', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const deleteResult = await service.clearCart(userEntityMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
    expect(spy.mock.calls[0][0]).toEqual({ ...cartMock, active: false });
  });

  it('should throw not found exception when the cart could no be found in the clearCart method', () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.clearCart(userEntityMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return cart when getCartByUserId method succeeds (no relation)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.getCartByUserId(userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual(undefined);
  });

  it('should return cart when getCartByUserId method succeeds (with relation)', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.getCartByUserId(userEntityMock.id, true);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0].relations).toEqual({
      cartProduct: { product: true },
    });
  });

  it('should throw not found exception when the cart could no be found in the getCartByUserId method', () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getCartByUserId(userEntityMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should save the info when create cart method succeeds', async () => {
    const spy = jest.spyOn(cartRepository, 'save');
    const cart = await service.createCart(userEntityMock.id);

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0]).toEqual({
      active: true,
      userId: userEntityMock.id,
    });
  });

  it('should return cart when insertProductInCart method succeed with no cart found', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );
    const cart = await service.insertProductInCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy).toHaveBeenCalled();
    expect(spyCartProductService).toHaveBeenCalled();
  });

  it('should return cart when insertProductInCart method succeed with existing cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );
    const cart = await service.insertProductInCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spyCartProductService).toHaveBeenCalled();
  });

  it('should return delete result when deleteProductCart method succeeds', async () => {
    const deleteProductCartMethod = jest.spyOn(
      cartProductService,
      'deleteProductCart',
    );
    const deleteResult = await service.deleteProductCart(
      productMock.id,
      userEntityMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
    expect(deleteProductCartMethod).toHaveBeenCalledTimes(1);
  });

  it('should throw not found exception when the cart could no be found in the deleteProductCart method', () => {
    const deleteProductCartMethod = jest.spyOn(
      cartProductService,
      'deleteProductCart',
    );
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.deleteProductCart(productMock.id, userEntityMock.id),
    ).rejects.toThrow(NotFoundException);
    expect(deleteProductCartMethod).toHaveBeenCalledTimes(0);
  });

  it('should return cart when updateProductInCart method succeed with no cart found', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'updateProductInCart',
    );
    const cart = await service.updateProductInCart(
      insertCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy).toHaveBeenCalled();
    expect(spyCartProductService).toHaveBeenCalled();
  });

  it('should return cart when updateProductInCart method succeed with existing cart', async () => {
    const createCartMethod = jest.spyOn(cartRepository, 'save');
    const updateProductInCartMethod = jest.spyOn(
      cartProductService,
      'updateProductInCart',
    );
    const cart = await service.updateProductInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(createCartMethod).toHaveBeenCalledTimes(0);
    expect(updateProductInCartMethod).toHaveBeenCalled();
  });
});
