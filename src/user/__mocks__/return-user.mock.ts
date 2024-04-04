import { ReturnUserDTO } from '../dtos/returnUser.dto';
import { userEntityMock } from './user.mock';

export const returnUserMock: ReturnUserDTO = {
  cpf: userEntityMock.cpf,
  email: userEntityMock.email,
  id: userEntityMock.id,
  name: userEntityMock.name,
  phone: userEntityMock.phone,
};
