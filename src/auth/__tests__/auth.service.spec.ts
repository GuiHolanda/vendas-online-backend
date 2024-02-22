import { Test, TestingModule } from '@nestjs/testing';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { loginDTOMock } from '../__mocks__/loginDTO.mock';
import { jwtMock } from '../__mocks__/jwt.mock';
import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if login and password are valid', async () => {
    const returnLoginObject = await service.login(loginDTOMock);
    expect(returnLoginObject).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDTO(userEntityMock),
    });
  });

  it('should throw error if login is valid and password invalid', async () => {
    expect(
      service.login({ ...loginDTOMock, password: '4324' }),
    ).rejects.toThrow();
  });

  it('should throw error if email does not exists', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(undefined);

    expect(service.login(loginDTOMock)).rejects.toThrow();
  });
  it('should throw error if exception occurs in getUserByEmail ', async () => {
    jest
      .spyOn(userService, 'getUserByEmail')
      .mockRejectedValueOnce(new Error());

    expect(service.login(loginDTOMock)).rejects.toThrow();
  });
});
