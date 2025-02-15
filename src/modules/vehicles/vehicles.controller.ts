// src/modules/vehicles/vehicles.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Cria um novo veículo.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return await this.vehiclesService.create(createVehicleDto);
  }

  /**
   * Retorna todos os veículos.
   */
  @Get()
  async findAll(): Promise<Vehicle[]> {
    return await this.vehiclesService.findAll();
  }

  /**
   * Retorna um veículo pelo seu UUID.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Vehicle> {
    return await this.vehiclesService.findOne(id);
  }

  /**
   * Atualiza um veículo existente.
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return await this.vehiclesService.update(id, updateVehicleDto);
  }

  /**
   * Remove um veículo pelo seu UUID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    return await this.vehiclesService.remove(id);
  }
}
