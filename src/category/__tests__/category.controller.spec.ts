import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { returnCategoryMock } from '../__mocks__/return-category.mock';
import { createCategoryMock } from '../__mocks__/create-category.mock';
import { categoryMock } from '../__mocks__/category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getAllCategories: jest.fn().mockResolvedValue([returnCategoryMock]),
            createCategory: jest.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return all categories in getAllCategories method', async () => {
    const categories = await controller.getAllCategories();

    expect(categories).toEqual([returnCategoryMock]);
  });

  it('should return all createCategory in createCategory method', async () => {
    const category = await controller.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });
});
