import { categoryMock } from '../../category/__mocks__/category.mock';
import { CategoryTotals } from '../dtos/returnCountProductsByCategoryId.dto';

export const countProductMock: CategoryTotals = {
  category_id: categoryMock.id,
  count: 4,
};
