// src/modules/clients/clients.controller.ts
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
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Creates a new client.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createClientDto: CreateClientDto,
  ): Promise<Client> {
    return await this.clientsService.create(createClientDto);
  }

  /**
   * Returns all clients.
   */
  @Get()
  async findAll(): Promise<Client[]> {
    return await this.clientsService.findAll();
  }

  /**
   * Returns a client by its UUID.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Client> {
    return await this.clientsService.findOne(id);
  }

  /**
   * Updates an existing client.
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientsService.update(id, updateClientDto);
  }

  /**
   * Removes a client by its UUID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    return await this.clientsService.remove(id);
  }
}
