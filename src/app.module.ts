import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database.module';
import { ClientsModule } from './modules/clients/clients.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { TransportsModule } from './modules/transports/transports.module';
import { RoutingModule } from './modules/routing/routing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ClientsModule,
    VehiclesModule,
    DriversModule,
    TransportsModule,
    RoutingModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
