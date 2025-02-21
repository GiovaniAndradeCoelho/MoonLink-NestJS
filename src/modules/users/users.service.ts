// src/modules/users/users.service.ts

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user.
   *
   * @param createUserDto - Data Transfer Object containing data for user creation.
   * @returns A promise that resolves to the created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error: any) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  /**
   * Retrieves all users.
   *
   * @returns A promise that resolves to an array of users.
   */
  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error: any) {
      this.logger.error(`Error retrieving users: ${error.message}`, error.stack);
      throw new BadRequestException(`Error retrieving users: ${error.message}`);
    }
  }

  /**
   * Retrieves a user by its ID.
   *
   * @param id - The ID of the user.
   * @returns A promise that resolves to the found user.
   * @throws NotFoundException if the user is not found.
   */
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error: any) {
      this.logger.error(`Error retrieving user with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing user.
   *
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing updated user data.
   * @returns A promise that resolves to the updated user.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.usersRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error: any) {
      this.logger.error(`Error updating user with id ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Removes a user by its ID.
   *
   * @param id - The ID of the user to remove.
   * @returns A promise that resolves when the user is removed.
   * @throws NotFoundException if the user is not found.
   */
  async remove(id: string): Promise<void> {
    try {
      const result = await this.usersRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
    } catch (error: any) {
      this.logger.error(`Error removing user with id ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`Error removing user: ${error.message}`);
    }
  }

  /**
   * Blocks a user.
   *
   * @param id - The ID of the user to block.
   * @param blockReason - Optional reason for blocking the user.
   * @returns A promise that resolves to the blocked user.
   */
  async blockUser(id: string, blockReason?: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isBlocked = true;
      user.blockReason = blockReason;
      return await this.usersRepository.save(user);
    } catch (error: any) {
      this.logger.error(`Error blocking user with id ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`Error blocking user: ${error.message}`);
    }
  }

  /**
   * Unblocks a user.
   *
   * @param id - The ID of the user to unblock.
   * @returns A promise that resolves to the unblocked user.
   */
  async unblockUser(id: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isBlocked = false;
      user.blockReason = null;
      return await this.usersRepository.save(user);
    } catch (error: any) {
      this.logger.error(`Error unblocking user with id ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`Error unblocking user: ${error.message}`);
    }
  }

  /**
   * Bans a user.
   *
   * @param id - The ID of the user to ban.
   * @param banReason - Optional reason for banning the user.
   * @returns A promise that resolves to the banned user.
   */
  async banUser(id: string, banReason?: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isBanned = true;
      user.banReason = banReason;
      return await this.usersRepository.save(user);
    } catch (error: any) {
      this.logger.error(`Error banning user with id ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`Error banning user: ${error.message}`);
    }
  }

  /**
   * Unbans a user.
   *
   * @param id - The ID of the user to unban.
   * @returns A promise that resolves to the unbanned user.
   */
  async unbanUser(id: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isBanned = false;
      user.banReason = null;
      return await this.usersRepository.save(user);
    } catch (error: any) {
      this.logger.error(`Error unbanning user with id ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`Error unbanning user: ${error.message}`);
    }
  }
}
