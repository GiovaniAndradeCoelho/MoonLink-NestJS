// src/modules/drivers/drivers.controller.ts

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
  Query,
  Req,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface'; // Adjust path as needed
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateDriverDocumentsDto } from './dto/update-driver-documents.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  /**
   * Creates a new driver.
   *
   * @param createDriverDto - DTO containing the driver creation data.
   * @param req - The request object containing user information.
   * @returns A promise that resolves to the newly created Driver.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createDriverDto: CreateDriverDto,
    @Req() req: RequestWithUser,
  ): Promise<Driver> {
    const userId = req.user.id;
    return this.driversService.create(createDriverDto, userId);
  }

  /**
   * Retrieves all drivers.
   *
   * @param fields - Optional comma-separated string of fields to select.
   * @returns A promise that resolves to an array of Drivers.
   */
  @Get()
  async findAll(@Query('fields') fields: string): Promise<Driver[]> {
    const fieldsArray = fields ? fields.split(',').map(f => f.trim()) : undefined;
    return this.driversService.findAll(fieldsArray);
  }

  /**
   * Retrieves a driver by its UUID.
   *
   * @param id - The UUID of the driver.
   * @returns A promise that resolves to the Driver.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Driver> {
    return this.driversService.findOne(id);
  }

  /**
   * Updates an existing driver.
   *
   * @param id - The UUID of the driver to update.
   * @param updateDriverDto - DTO containing the updated driver data.
   * @param req - The request object containing user information.
   * @returns A promise that resolves to the updated Driver.
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateDriverDto: UpdateDriverDto,
    @Req() req: RequestWithUser,
  ): Promise<Driver> {
    const userId = req.user.id;
    return this.driversService.update(id, updateDriverDto, userId);
  }

  /**
   * Soft-deletes a driver.
   *
   * @param id - The UUID of the driver to remove.
   * @param req - The request object containing user information.
   * @returns A promise that resolves to an object with a success message.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.driversService.remove(id, userId);
  }

  /**
   * Assigns a vehicle to a driver.
   *
   * @param driverId - The UUID of the driver.
   * @param assignVehicleDto - DTO containing the vehicle assignment data.
   * @returns A promise that resolves to the updated Driver.
   */
  @Post(':id/vehicles')
  @HttpCode(HttpStatus.OK)
  async assignVehicle(
    @Param('id', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    assignVehicleDto: AssignVehicleDto,
  ): Promise<Driver> {
    return this.driversService.assignVehicle(driverId, assignVehicleDto.vehicleId);
  }

  /**
   * Updates the driver's documents and approval status.
   *
   * @param driverId - The UUID of the driver.
   * @param updateDriverDocumentsDto - DTO containing the document update data.
   * @param req - The request object containing user information.
   * @returns A promise that resolves to the updated Driver.
   */
  @Put(':id/documents')
  async updateDriverDocuments(
    @Param('id', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateDriverDocumentsDto: UpdateDriverDocumentsDto,
    @Req() req: RequestWithUser,
  ): Promise<Driver> {
    const userId = req.user.id;
    return this.driversService.updateDriverDocuments(driverId, updateDriverDocumentsDto, userId);
  }
}