import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';

@Module({
  controllers: [TransportsController],
  providers: [TransportsService],
})
export class TransportsModule {}
