import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';

export interface ReturnLogin {
  user: ReturnUserDTO;
  accessToken: string;
}
