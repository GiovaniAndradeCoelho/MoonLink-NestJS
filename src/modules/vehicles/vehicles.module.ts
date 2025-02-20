// src/modules/vehicles/vehicles.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * VehiclesModule encapsulates all components related to vehicle management.
 *
 * This module imports:
 * - TypeOrmModule: Registers the Vehicle entity for database operations.
 * - NotificationsModule: Handles notifications for vehicle events.
 *
 * It provides:
 * - VehiclesController: Manages incoming HTTP requests for vehicles.
 * - VehiclesService: Contains business logic for creating, updating, retrieving, 
 *   and deleting vehicles.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    NotificationsModule,
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
