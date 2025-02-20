import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ValidationPipe, Query, Req } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface'; // ajuste o caminho conforme sua estrutura
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { UpdateDriverDocumentsDto } from './dto/update-driver-documents.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createDriverDto: CreateDriverDto,
    @Req() req: RequestWithUser,
  ): Promise<Driver> {
    const userId = req.user.id;
    return await this.driversService.create(createDriverDto, userId);
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
    @Req() req: RequestWithUser,
  ): Promise<Driver> {
    const userId = req.user.id;
    return await this.driversService.update(id, updateDriverDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    return await this.driversService.remove(id, userId);
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

  @Put(':id/documents')
  async updateDriverDocuments(
    @Param('id', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateDriverDocumentsDto: UpdateDriverDocumentsDto,
    @Req() req: RequestWithUser,
  ): Promise<Driver> {
    const userId = req.user.id;
    return await this.driversService.updateDriverDocuments(driverId, updateDriverDocumentsDto, userId);
  }
}
