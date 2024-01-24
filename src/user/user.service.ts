import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dtos/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/interfaces/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const saltOrRounds = 10;
    const hashedPassword = await hash(createUserDTO.password, saltOrRounds);

    return this.userRepository.save({
      ...createUserDTO,
      password: hashedPassword,
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
