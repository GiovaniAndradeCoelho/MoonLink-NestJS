// src/modules/clients/clients.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';

/**
 * ClientsModule encapsulates all client-related operations.
 *
 * This module imports:
 * - TypeOrmModule: Registers the Client entity for database interactions.
 *
 * It provides:
 * - ClientsController: Handles HTTP requests for client operations.
 * - ClientsService: Contains business logic for managing clients.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
