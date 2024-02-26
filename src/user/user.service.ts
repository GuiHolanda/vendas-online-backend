import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dtos/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { hash } from 'bcrypt';
import { UserType } from './enum/user-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const user = await this.getUserByEmail(createUserDTO.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const saltOrRounds = 10;
    const hashedPassword = await hash(createUserDTO.password, saltOrRounds);

    return this.userRepository.save({
      ...createUserDTO,
      typeUser: UserType.User,
      password: hashedPassword,
    });
  }

  async getUserWithRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('UserId not found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('email not found');
    }

    return user;
  }
}
