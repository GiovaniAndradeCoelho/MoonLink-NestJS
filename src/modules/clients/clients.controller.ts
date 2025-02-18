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

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  /**
   * Cria um novo cliente.
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
   * Retorna todos os clientes.
   */
  @Get()
  async findAll(): Promise<Client[]> {
    return await this.clientsService.findAll();
  }

  /**
   * Retorna um cliente pelo seu UUID.
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Client> {
    return await this.clientsService.findOne(id);
  }

  /**
   * Atualiza um cliente existente.
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
   * Realiza a remoção soft delete de um cliente pelo seu UUID.
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
