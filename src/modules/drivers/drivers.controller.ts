// src/modules/drivers/drivers.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ValidationPipe, Query } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateDriverDocumentsDto } from './dto/update-driver-documents.dto';
import { fileURLToPath } from 'url';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createDriverDto: CreateDriverDto,
  ): Promise<Driver> {
    return await this.driversService.create(createDriverDto);
  }

  @Get()
  async findAll(@Query('fields') fields: string): Promise<Driver[]> {
    const fieldsArray = fields ? fields.split(',').map(f => f.trim()) : undefined;
    return await this.driversService.findAll(fieldsArray);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Driver> {
    return await this.driversService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    return await this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    return await this.driversService.remove(id);
  }

  @Post(':id/vehicles')
  @HttpCode(HttpStatus.OK)
  async assignVehicle(
    @Param('id', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    assignVehicleDto: AssignVehicleDto,
  ): Promise<Driver> {
    return await this.driversService.assignVehicle(driverId, assignVehicleDto.vehicleId);
  }

  /**
   * Atualiza a documentação e o status de aprovação do motorista (funil de validação)
   */
  @Put(':id/documents')
  async updateDriverDocuments(
    @Param('id', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateDriverDocumentsDto: UpdateDriverDocumentsDto,
  ): Promise<Driver> {
    return await this.driversService.updateDriverDocuments(driverId, updateDriverDocumentsDto);
  }
}
