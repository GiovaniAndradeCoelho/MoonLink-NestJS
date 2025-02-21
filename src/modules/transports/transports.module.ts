// src/modules/transports/transports.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * TransportsModule encapsulates all components related to transport management.
 *
 * This module imports:
 * - TypeOrmModule: Registers the Transport, Driver, and Vehicle entities for database interactions.
 * - NotificationsModule: Provides notification services for transport-related events.
 *
 * It provides:
 * - TransportsService: Business logic for creating, updating, retrieving, and removing transports.
 * - TransportsController: RESTful endpoints for managing transports.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Transport, Driver, Vehicle]),
    NotificationsModule,
  ],
  providers: [TransportsService],
  controllers: [TransportsController],
})
export class TransportsModule {}
