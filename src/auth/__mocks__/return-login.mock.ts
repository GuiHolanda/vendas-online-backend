import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';
import { ReturnLoginDTO } from '../dtos/returnLogin.dto';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLoginDTO = {
  accessToken: jwtMock,
  user: new ReturnUserDTO(userEntityMock),
};
