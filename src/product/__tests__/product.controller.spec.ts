import { Test, TestingModule } from '@nestjs/testing';
import { productMock } from '../__mocks__/product.mock';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { returnProductMock } from '../__mocks__/return-product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productMock]),
            createProduct: jest.fn().mockResolvedValue(productMock),
            deleteProduct: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProduct: jest.fn().mockResolvedValue(productMock),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return products in findAll method', async () => {
    const products = await controller.findAll();

    expect(products).toEqual([returnProductMock]);
  });

  it('should return product in createProduct method', async () => {
    const product = await controller.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('should return deleteResult in deleteProduct method', async () => {
    const deleteResult = await controller.deleteProduct(productMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return product in updateProduct method', async () => {
    const product = await controller.updateProduct(
      updateProductMock,
      productMock.id,
    );

    expect(product).toEqual(productMock);
  });
});
