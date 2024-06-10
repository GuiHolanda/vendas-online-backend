import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import { updatePasswordMock } from '../__mocks__/updateUser.mock';
import { ReturnUserDTO } from '../dtos/returnUser.dto';
import { returnUserMock } from '../__mocks__/return-user.mock';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userEntityMock),
            getAllUsers: jest.fn().mockResolvedValue([userEntityMock]),
            getUserWithRelations: jest.fn().mockResolvedValue(userEntityMock),
            updatePassword: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user in createUser method', async () => {
    const user = await controller.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
  });

  it('should return all users in getAllUsers method', async () => {
    const users = await controller.getAllUsers();

    expect(users).toEqual([returnUserMock]);
  });

  it('should return user in getUserById method', async () => {
    const user = await controller.getUserById(userEntityMock.id);

    expect(user).toEqual(returnUserMock);
  });

  it('should return user in updateUserPassword method', async () => {
    const user = await controller.updateUserPassword(
      updatePasswordMock,
      userEntityMock.id,
    );

    expect(user).toEqual(userEntityMock);
  });

  it('should return ReturnUserEntity in getInfoUser', async () => {
    const user = await controller.getUserInfo(userEntityMock.id);

    expect(user).toEqual(new ReturnUserDTO(userEntityMock));
  });
});
