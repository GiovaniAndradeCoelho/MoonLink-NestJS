// src/modules/vehicles/vehicles.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Creates a new vehicle.
   *
   * @param createVehicleDto - Data Transfer Object containing vehicle creation data.
   * @returns A promise that resolves to the newly created Vehicle.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * Retrieves all vehicles.
   *
   * @returns A promise that resolves to an array of Vehicle objects.
   */
  @Get()
  findAll(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  /**
   * Retrieves a vehicle by its UUID.
   *
   * @param id - The UUID of the vehicle.
   * @returns A promise that resolves to the Vehicle with the given id.
   */
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Vehicle> {
    return this.vehiclesService.findOne(id);
  }

  /**
   * Updates an existing vehicle.
   *
   * @param id - The UUID of the vehicle to update.
   * @param updateVehicleDto - Data Transfer Object containing updated vehicle data.
   * @returns A promise that resolves to the updated Vehicle.
   */
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  /**
   * Removes a vehicle by its UUID.
   *
   * @param id - The UUID of the vehicle to remove.
   * @returns A promise that resolves to an object containing a success message.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    return this.vehiclesService.remove(id);
  }
}
