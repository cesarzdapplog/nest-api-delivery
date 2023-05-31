import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(CreateUserDto: CreateUserDto) {
    return this.userRepository.save(CreateUserDto);
  }

  async update(id: number, data: Partial<UpdateUserDto>) {
    await this.userRepository.update({ id }, data);
    return await this.userRepository.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOnebyUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
