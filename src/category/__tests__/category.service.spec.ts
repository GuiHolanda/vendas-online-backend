import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/create-category.mock';
import { ProductService } from '../../product/product.service';
import { countProductMock } from '../../product/__mocks__/countProduct.mock';
import { ReturnCategory } from '../dtos/return-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(categoryMock),
            find: jest.fn().mockResolvedValue([categoryMock]),
            save: jest.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            countProductsByCategoryId: jest
              .fn()
              .mockResolvedValue([countProductMock]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    productService = module.get(ProductService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return category list', async () => {
    const categoryList = await service.getAllCategories();

    expect(categoryList).toEqual([
      new ReturnCategory(categoryMock, countProductMock.count),
    ]);
  });

  it('should return error when categoryList is empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    expect(service.getAllCategories()).rejects.toThrow();
  });

  it('should return error when category repository throws an exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.getAllCategories()).rejects.toThrow();
  });

  it('should return error if exist category name', async () => {
    expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });

  it('should return category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return error if an exception occurs after save in createCategory', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });

  it('should return category with getCategoryByName', async () => {
    const category = await service.getCategoryByName(categoryMock.name);

    expect(category).toEqual(categoryMock);
  });

  it('should return error when getCategoryByName is empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getCategoryByName(categoryMock.name)).rejects.toThrow();
  });

  it('should return category with getCategoryById', async () => {
    const category = await service.getCategoryById(categoryMock.id);

    expect(category).toEqual(categoryMock);
  });

  it('should return error when getCategoryById is empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.getCategoryById(categoryMock.id)).rejects.toThrow();
  });
});
