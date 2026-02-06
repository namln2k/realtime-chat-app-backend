import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOne(options);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async save(user: DeepPartial<User>) {
    return await this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: DeepPartial<User>) {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }
}
