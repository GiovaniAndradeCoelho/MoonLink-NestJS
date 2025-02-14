// src/modules/clients/clients.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientType } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Helper function to format the address object into a string.
   * Expected properties: street, number, neighborhood, city, state, zipcode.
   */
  private formatAddress(address: { street: string; number: string; neighborhood: string; city: string; state: string; zipcode: string; }): string {
    return `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipcode}`;
  }

  /**
   * Creates a new client.
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const { address, ...clientData } = createClientDto;
      let formattedAddress: any = null;
      if (address) {
        formattedAddress = this.formatAddress(address);
      }
      // Build the client object using the formatted address.
      const client = this.clientRepository.create({
        ...clientData,
        address: formattedAddress,
      });
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new BadRequestException(`Error creating client: ${error.message}`);
    }
  }

  /**
   * Retrieves all clients.
   */
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  /**
   * Retrieves a client by its UUID.
   */
  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  /**
   * Updates an existing client.
   */
  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    const { address, ...clientData } = updateClientDto;
    let formattedAddress: string = client.address; // preserve existing address if not updated
    if (address) {
      formattedAddress = this.formatAddress(address);
    }
    const updatedClient = Object.assign(client, {
      ...clientData,
      address: formattedAddress,
    });
    try {
      return await this.clientRepository.save(updatedClient);
    } catch (error) {
      throw new BadRequestException(`Error updating client: ${error.message}`);
    }
  }

  /**
   * Removes a client by its UUID.
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return { message: 'Client successfully removed' };
  }
}
