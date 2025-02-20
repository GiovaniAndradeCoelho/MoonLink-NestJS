// src/modules/clients/clients.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

/**
 * ClientsController provides RESTful endpoints for managing client records.
 */
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Creates a new client.
   *
   * @param userId - The user ID from the request headers (x-user-id).
   * @param createClientDto - Data Transfer Object containing client creation data.
   * @returns A promise that resolves to the newly created Client.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('x-user-id') userId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createClientDto: CreateClientDto,
  ): Promise<Client> {
    return await this.clientsService.create(createClientDto, userId);
  }

  /**
   * Retrieves all clients that have not been soft-deleted.
   *
   * @returns A promise that resolves to an array of Client objects.
   */
  @Get()
  async findAll(): Promise<Client[]> {
    return await this.clientsService.findAll();
  }

  /**
   * Retrieves a client by its UUID.
   *
   * @param id - The UUID of the client.
   * @returns A promise that resolves to the Client object.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Client> {
    return await this.clientsService.findOne(id);
  }

  /**
   * Updates an existing client.
   *
   * @param userId - The user ID from the request headers (x-user-id).
   * @param id - The UUID of the client to update.
   * @param updateClientDto - Data Transfer Object containing updated client data.
   * @returns A promise that resolves to the updated Client.
   */
  @Put(':id')
  async update(
    @Headers('x-user-id') userId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientsService.update(id, updateClientDto, userId);
  }

  /**
   * Soft-deletes a client by its UUID.
   *
   * @param userId - The user ID from the request headers (x-user-id).
   * @param id - The UUID of the client to remove.
   * @returns A promise that resolves to an object containing a success message.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Headers('x-user-id') userId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return await this.clientsService.remove(id, userId);
  }
}
