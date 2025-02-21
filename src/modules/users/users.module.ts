// src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * UsersModule encapsulates all components related to user management.
 *
 * This module imports:
 * - TypeOrmModule: Registers the User entity for database interactions.
 *
 * It provides:
 * - UsersService: Contains the business logic for user operations.
 * - UsersController: Exposes RESTful endpoints for managing users.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
