// src/modules/transports/transports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transport, Driver, Vehicle]),
    NotificationsModule,
  ],
  providers: [TransportsService],
  controllers: [TransportsController],
})
export class TransportsModule {}
