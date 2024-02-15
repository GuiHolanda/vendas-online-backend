import { ReturnUserDTO } from 'src/user/dtos/returnUser.dto';

export interface ReturnLogin {
  user: ReturnUserDTO;
  accessToken: string;
}
