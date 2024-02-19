import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user with getUserByEmail', async () => {
    const user = await service.getUserByEmail(userEntityMock.email);
    expect(user).toEqual(userEntityMock);
  });

  it('should return exception in getUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrow();
  });

  it('should return exception in getUserByEmail (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrow();
  });

  it('should return user with getUserById', async () => {
    const user = await service.getUserById(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return exception in getUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    expect(service.getUserById(userEntityMock.id)).rejects.toThrow();
  });

  it('should return exception in getUserById (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.getUserById(userEntityMock.id)).rejects.toThrow();
  });

  it('should return user with getUserWithRelations', async () => {
    const user = await service.getUserWithRelations(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return error when creating an user with createUser if the user already exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrow();
  });

  it('should return the user when creating an user with createUser if the user does not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
  });
});
