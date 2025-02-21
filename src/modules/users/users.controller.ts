// src/modules/users/users.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UsersService } from './users.service';

/**
 * UsersController handles user-related HTTP requests.
 * Provides endpoints to create, retrieve, update, delete, block/unblock, and ban/unban users.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   *
   * @param createUserDto - Data Transfer Object containing user creation data.
   * @returns The newly created user.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves all users.
   *
   * @returns An array of users.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a user by its ID.
   *
   * @param id - The ID of the user.
   * @returns The user with the specified ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Updates an existing user.
   *
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing updated user data.
   * @returns The updated user.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Removes a user.
   *
   * @param id - The ID of the user to remove.
   * @returns The removed user.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  /**
   * Blocks a user.
   *
   * @param id - The ID of the user to block.
   * @param blockUserDto - DTO containing the block reason.
   * @returns The blocked user.
   */
  @Patch(':id/block')
  blockUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    blockUserDto: BlockUserDto,
  ) {
    return this.usersService.blockUser(id, blockUserDto.blockReason);
  }

  /**
   * Unblocks a user.
   *
   * @param id - The ID of the user to unblock.
   * @returns The unblocked user.
   */
  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.usersService.unblockUser(id);
  }

  /**
   * Bans a user.
   *
   * @param id - The ID of the user to ban.
   * @param banUserDto - DTO containing the ban reason.
   * @returns The banned user.
   */
  @Patch(':id/ban')
  banUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    banUserDto: BanUserDto,
  ) {
    return this.usersService.banUser(id, banUserDto.banReason);
  }

  /**
   * Unbans a user.
   *
   * @param id - The ID of the user to unban.
   * @returns The unbanned user.
   */
  @Patch(':id/unban')
  unbanUser(@Param('id') id: string) {
    return this.usersService.unbanUser(id);
  }
}