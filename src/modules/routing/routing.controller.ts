// src/modules/routing/routing.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { RoutingService } from './routing.service';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';

/**
 * Data Transfer Object for calculating a route.
 */
export class CalculateRouteDto {
  @IsString()
  @IsNotEmpty()
  originAddress: string;

  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stopsAddresses?: string[];
}

/**
 * RoutingController exposes endpoints for geocoding addresses and calculating routes.
 */
@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  /**
   * Calculates a route based on the provided origin, destination, and optional stop addresses.
   *
   * @param calculateRouteDto - DTO containing originAddress, destinationAddress, and optionally stopsAddresses.
   * @returns A promise resolving to the calculated route details including distance, duration, and geometry.
   */
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculateRoute(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    calculateRouteDto: CalculateRouteDto,
  ): Promise<any> {
    const { originAddress, destinationAddress, stopsAddresses } = calculateRouteDto;
    return await this.routingService.calculateRouteByAddresses(
      originAddress,
      destinationAddress,
      stopsAddresses || [],
    );
  }
}
