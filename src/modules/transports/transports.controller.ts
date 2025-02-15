// src/modules/transports/transports.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { Transport } from './entities/transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';

@Controller('transports')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

  /**
   * Cria um novo transporte.
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
   * Retorna todos os transportes.
   */
  @Get()
  async findAll(): Promise<Transport[]> {
    return await this.transportsService.findAll();
  }

  /**
   * Retorna um transporte pelo seu UUID.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Transport> {
    return await this.transportsService.findOne(id);
  }

  /**
   * Atualiza os dados de um transporte existente.
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
   * Remove um transporte pelo seu UUID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    return await this.transportsService.remove(id);
  }
}
