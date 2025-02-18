// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async blockUser(id: string, blockReason?: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBlocked = true;
    user.blockReason = blockReason;
    return this.usersRepository.save(user);
  }

  async unblockUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBlocked = false;
    user.blockReason = null;
    return this.usersRepository.save(user);
  }

  async banUser(id: string, banReason?: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBanned = true;
    user.banReason = banReason;
    return this.usersRepository.save(user);
  }

  async unbanUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBanned = false;
    user.banReason = null;
    return this.usersRepository.save(user);
  }
}
