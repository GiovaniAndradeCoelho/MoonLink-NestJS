// src/modules/drivers/drivers.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './entities/driver.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * DriversModule encapsulates all components related to driver management.
 *
 * This module imports:
 * - TypeOrmModule: Registers the Driver and Vehicle entities for database operations.
 * - NotificationsModule: Provides notification services for driver-related events.
 *
 * It provides:
 * - DriversController: Exposes RESTful endpoints for driver operations.
 * - DriversService: Contains business logic for creating, updating, retrieving, and removing drivers.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, Vehicle]),
    NotificationsModule,
  ],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
