// src/modules/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UsersService } from './users.controller';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Funcionalidades adicionais: bloqueio e banimento

  @Patch(':id/block')
  blockUser(@Param('id') id: string, @Body() blockUserDto: BlockUserDto) {
    return this.usersService.blockUser(id, blockUserDto.blockReason);
  }

  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.usersService.unblockUser(id);
  }

  @Patch(':id/ban')
  banUser(@Param('id') id: string, @Body() banUserDto: BanUserDto) {
    return this.usersService.banUser(id, banUserDto.banReason);
  }

  @Patch(':id/unban')
  unbanUser(@Param('id') id: string) {
    return this.usersService.unbanUser(id);
  }
}
