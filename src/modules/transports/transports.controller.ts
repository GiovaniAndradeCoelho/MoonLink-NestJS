// src/modules/transports/transports.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { Transport } from './entities/transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';

/**
 * TransportsController provides RESTful endpoints for managing transports.
 */
@Controller('transports')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

  /**
   * Creates a new transport.
   *
   * @param createTransportDto - DTO containing transport creation data.
   * @returns A promise that resolves to the created Transport.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createTransportDto: CreateTransportDto,
  ): Promise<Transport> {
    return await this.transportsService.create(createTransportDto);
  }

  /**
   * Retrieves all transports.
   *
   * @returns A promise that resolves to an array of Transport objects.
   */
  @Get()
  async findAll(): Promise<Transport[]> {
    return await this.transportsService.findAll();
  }

  /**
   * Retrieves a transport by its UUID.
   *
   * @param id - The UUID of the transport.
   * @returns A promise that resolves to the Transport.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Transport> {
    return await this.transportsService.findOne(id);
  }

  /**
   * Updates an existing transport.
   *
   * @param id - The UUID of the transport to update.
   * @param updateTransportDto - DTO containing updated transport data.
   * @returns A promise that resolves to the updated Transport.
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateTransportDto: UpdateTransportDto,
  ): Promise<Transport> {
    return await this.transportsService.update(id, updateTransportDto);
  }

  /**
   * Removes a transport by its UUID.
   *
   * @param id - The UUID of the transport to remove.
   * @returns A promise that resolves to an object with a success message.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    return await this.transportsService.remove(id);
  }
}
