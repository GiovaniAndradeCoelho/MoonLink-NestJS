// src/modules/clients/clients.service.ts

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Formats an address object into a single string.
   * Expected properties: street, number, neighborhood, city, state, zipcode.
   *
   * @param address - The address object.
   * @returns The formatted address string.
   */
  private formatAddress(address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  }): string {
    return `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipcode}`;
  }

  /**
   * Creates a new client.
   *
   * @param createClientDto - Data for creating the client.
   * @param userId - ID of the user creating the client.
   * @returns A promise that resolves to the created Client.
   * @throws {BadRequestException} If an error occurs during creation.
   */
  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    try {
      const { address, ...clientData } = createClientDto;
      let formattedAddress: string | undefined = undefined;
      if (address) {
        formattedAddress = this.formatAddress(address);
      }
      const client = this.clientRepository.create({
        ...clientData,
        address: formattedAddress,
        createdBy: userId,
      });
      return await this.clientRepository.save(client);
    } catch (error) {
      this.logger.error(`Error creating client: ${error.message}`);
      throw new BadRequestException(`Error creating client: ${error.message}`);
    }
  }

  /**
   * Retrieves all clients that have not been soft-deleted.
   *
   * @returns A promise that resolves to an array of Clients.
   */
  async findAll(): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ where: { removedAt: IsNull() } });
    } catch (error) {
      this.logger.error(`Error retrieving clients: ${error.message}`);
      throw new BadRequestException(`Error retrieving clients: ${error.message}`);
    }
  }

  /**
   * Retrieves a client by its UUID.
   *
   * @param id - The UUID of the client.
   * @returns A promise that resolves to the Client.
   * @throws {NotFoundException} If the client is not found.
   */
  async findOne(id: string): Promise<Client> {
    try {
      const client = await this.clientRepository.findOne({ where: { id, removedAt: IsNull() } });
      if (!client) {
        throw new NotFoundException(`Client with id ${id} not found`);
      }
      return client;
    } catch (error) {
      this.logger.error(`Error retrieving client: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates an existing client.
   *
   * @param id - The UUID of the client.
   * @param updateClientDto - Data for updating the client.
   * @param userId - ID of the user performing the update.
   * @returns A promise that resolves to the updated Client.
   * @throws {BadRequestException} If an error occurs during update.
   */
  async update(id: string, updateClientDto: UpdateClientDto, userId: string): Promise<Client> {
    const client = await this.findOne(id);
    const { address, ...clientData } = updateClientDto;
    let formattedAddress: string | undefined = client.address; // Preserve the existing address if not updated.
    if (address) {
      formattedAddress = this.formatAddress(address);
    }
    const updatedClient = Object.assign(client, {
      ...clientData,
      address: formattedAddress,
      updatedBy: userId,
    });
    try {
      return await this.clientRepository.save(updatedClient);
    } catch (error) {
      this.logger.error(`Error updating client: ${error.message}`);
      throw new BadRequestException(`Error updating client: ${error.message}`);
    }
  }

  /**
   * Soft-deletes a client by its UUID.
   *
   * @param id - The UUID of the client.
   * @param userId - ID of the user performing the deletion.
   * @returns A promise that resolves to an object with a success message.
   * @throws {BadRequestException} If an error occurs during removal.
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const client = await this.findOne(id);
    client.removedBy = userId;
    client.removedAt = new Date();
    try {
      await this.clientRepository.save(client);
      return { message: 'Client successfully removed (soft delete)' };
    } catch (error) {
      this.logger.error(`Error removing client: ${error.message}`);
      throw new BadRequestException(`Error removing client: ${error.message}`);
    }
  }
}
