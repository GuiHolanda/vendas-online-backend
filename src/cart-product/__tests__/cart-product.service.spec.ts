import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { ProductService } from '../../product/product.service';
import { CartProductEntity } from '../entities/cart-product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../../product/__mocks__/product.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { insertCartMock } from '../../cart/__mocks__/insert-cart.mock';
import { cartProductMock } from '../__mocks__/cart-product.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from '../../cart/__mocks__/update-cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProductById: jest.fn().mockResolvedValue(productMock),
          },
        },
        {
          provide: getRepositoryToken(CartProductEntity),

          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            save: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        CartProductService,
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  it('should return delete result after deleting product with deleteProductCart method', async () => {
    const deleteResult = await service.deleteProductCart(
      productMock.id,
      cartMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return error in exception with deleteProductCart method', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error());

    expect(
      service.deleteProductCart(productMock.id, cartMock.id),
    ).rejects.toThrow();
  });

  it('should return CartProduct after create  with createProductInCartMethod method', async () => {
    const cartProduct = await service.createProductInCart(
      insertCartMock,
      cartMock.id,
    );

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error in exception with createProductInCartMethod method', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createProductInCart(insertCartMock, cartMock.id),
    ).rejects.toThrow();
  });

  it('should return CartProduct after verifyProductInCart method ', async () => {
    const cartProduct = await service.verifyProductInCart(
      productMock.id,
      cartMock.id,
    );

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error if no product were found with verifyProductInCart method', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.verifyProductInCart(productMock.id, cartMock.id),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return error in exception with verifyProductInCart method', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.verifyProductInCart(productMock.id, cartMock.id),
    ).rejects.toThrow();
  });

  it('should return error in insertProductInCart if getProductById throws an exception', async () => {
    jest
      .spyOn(productService, 'getProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.insertProductInCart(insertCartMock, cartMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return CartProduct with insertCartMock amount in insertProductInCart method', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    const cartProduct = await service.insertProductInCart(
      insertCartMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(insertCartMock.amount);
  });

  it('should return CartProduct with combined amount in insertProductInCart method ', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      insertCartMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductMock,
      amount: cartProductMock.amount + insertCartMock.amount,
    });
  });

  it('should return error in updateProductInCart if getProductById throws an exception', async () => {
    jest
      .spyOn(productService, 'getProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.updateProductInCart(updateCartMock, cartMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return CartProduct with updateCartMock amount in updateProductInCart method', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.updateProductInCart(updateCartMock, cartMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return CartProduct with combined amount in updateProductInCart method ', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductInCart(
      updateCartMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateCartMock.amount);
  });
});
