// src/modules/routing/routing.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

class CalculateRouteDto {
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

@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  /**
   * Endpoint para calcular a rota a partir de endereços.
   * Recebe origem, destino e pontos de parada (opcional) e retorna a rota calculada.
   */
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculateRoute(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    calculateRouteDto: CalculateRouteDto,
  ): Promise<any> {
    const { originAddress, destinationAddress, stopsAddresses } = calculateRouteDto;
    return await this.routingService.calculateRouteByAddresses(originAddress, destinationAddress, stopsAddresses || []);
  }
}
