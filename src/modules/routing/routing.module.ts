// src/modules/routing/routing.module.ts

import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RoutingController } from './routing.controller';

/**
 * RoutingModule encapsulates all functionality related to routing operations.
 *
 * This module provides:
 * - RoutingService: Service responsible for geocoding addresses and calculating routes.
 * - RoutingController: Controller that exposes endpoints for routing operations.
 *
 * The RoutingService is exported for use in other modules.
 */
@Module({
  providers: [RoutingService],
  controllers: [RoutingController],
  exports: [RoutingService],
})
export class RoutingModule {}
