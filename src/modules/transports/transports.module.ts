import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transport, Driver, Vehicle])],
  controllers: [TransportsController],
  providers: [TransportsService],
})
export class TransportsModule {}
