// src/modules/clients/clients.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  /**
   * Formata o objeto de endereço em uma string.
   * Propriedades esperadas: street, number, neighborhood, city, state, zipcode.
   */
  private formatAddress(address: { street: string; number: string; neighborhood: string; city: string; state: string; zipcode: string; }): string {
    return `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipcode}`;
  }

  /**
   * Cria um novo cliente.
   * @param createClientDto Dados para criação do cliente.
   * @param userId ID do usuário que está criando o cliente.
   */
  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    try {
      const { address, ...clientData } = createClientDto;
      let formattedAddress: any = null;
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
      throw new BadRequestException(`Error creating client: ${error.message}`);
    }
  }

  /**
   * Retorna todos os clientes que não foram removidos (soft delete).
   */
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({ where: { removedAt: IsNull() } });
  }

  /**
   * Retorna um cliente pelo seu UUID.
   */
  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id, removedAt: IsNull() } });
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    return client;
  }

  /**
   * Atualiza um cliente existente.
   * @param id ID do cliente.
   * @param updateClientDto Dados para atualização do cliente.
   * @param userId ID do usuário que está realizando a atualização.
   */
  async update(id: string, updateClientDto: UpdateClientDto, userId: string): Promise<Client> {
    const client = await this.findOne(id);
    const { address, ...clientData } = updateClientDto;
    let formattedAddress: string = client.address; // Preserva o endereço existente se não for atualizado.
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
      throw new BadRequestException(`Error updating client: ${error.message}`);
    }
  }

  /**
   * Realiza a remoção soft delete de um cliente pelo seu UUID.
   * @param id ID do cliente.
   * @param userId ID do usuário que está removendo o cliente.
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const client = await this.findOne(id);
    client.removedBy = userId;
    client.removedAt = new Date();
    try {
      await this.clientRepository.save(client);
      return { message: 'Client successfully removed (soft delete)' };
    } catch (error) {
      throw new BadRequestException(`Error removing client: ${error.message}`);
    }
  }
}
