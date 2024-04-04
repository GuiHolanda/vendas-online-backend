import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { loginDTOMock } from '../__mocks__/loginDTO.mock';
import { returnLoginMock } from '../__mocks__/return-login.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(returnLoginMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should return returnLogin in login method', async () => {
    const returnLogin = await controller.login(loginDTOMock);

    expect(returnLogin).toEqual(returnLoginMock);
  });
});
