import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';

describe('ProductService', () => {
  let service: ProductService;
  let categoryService: CategoryService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            getCategoryById: jest.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAll();

    expect(products).toEqual([productMock]);
  });

  it('should return relations in find all products', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAll([], true);

    expect(products).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        category: true,
      },
    });
  });

  it('should return relatiosn and array in find all products', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAll([1], true);

    expect(products).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: In([1]),
      },
      relations: {
        category: true,
      },
    });
  });

  it('should return error if products is empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrow();
  });

  it('should return error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAll()).rejects.toThrow();
  });

  it('should return product after insert in DB', async () => {
    const product = await service.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('should return error in exception with getCategoryBtId method', async () => {
    jest
      .spyOn(categoryService, `getCategoryById`)
      .mockRejectedValue(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrow();
  });

  it('should return one product using getProductById', async () => {
    const product = await service.getProductById(productMock.id);

    expect(product).toEqual(productMock);
  });

  it('should return error if product were not found with getProductById', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getProductById(productMock.id)).rejects.toThrow();
  });

  it('should delete one product using deleteProduct', async () => {
    const productsAffected = await service.deleteProduct(productMock.id);

    expect(productsAffected).toEqual(returnDeleteMock);
  });

  it('should update product using updateProduct', async () => {
    const product = await service.updateProduct(
      updateProductMock,
      productMock.id,
    );

    expect(product).toEqual(productMock);
  });

  it('should return error in exception when updating product', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.updateProduct(updateProductMock, productMock.id),
    ).rejects.toThrow();
  });
});
