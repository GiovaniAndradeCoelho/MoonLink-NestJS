// src/modules/transports/transports.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from './entities/transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';
import { NotificationsService } from '../notifications/notifications/notifications.service';

@Injectable()
export class TransportsService {
  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Cria um novo transporte.
   */
  async create(createTransportDto: CreateTransportDto): Promise<Transport> {
    try {
      const { driverId, vehicleId, ...transportData } = createTransportDto;
      const transport = this.transportRepository.create(transportData);

      // Associa motorista, se informado
      if (driverId) {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });
        if (!driver) {
          throw new NotFoundException(`Motorista com id ${driverId} não encontrado`);
        }
        transport.driver = driver;
      }

      // Associa veículo, se informado
      if (vehicleId) {
        const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
        if (!vehicle) {
          throw new NotFoundException(`Veículo com id ${vehicleId} não encontrado`);
        }
        transport.vehicle = vehicle;
      }

      const savedTransport = await this.transportRepository.save(transport);

      // Envia notificação para criação de transporte
      this.notificationsService.notify({
        type: 'CREATE_TRANSPORT',
        data: savedTransport,
      });

      return savedTransport;
    } catch (error) {
      throw new BadRequestException(`Erro ao criar transporte: ${error.message}`);
    }
  }

  /**
   * Retorna todos os transportes cadastrados, incluindo motorista e veículo.
   */
  async findAll(): Promise<Transport[]> {
    return await this.transportRepository.find({ relations: ['driver', 'vehicle'] });
  }

  /**
   * Retorna um transporte pelo seu UUID.
   */
  async findOne(id: string): Promise<Transport> {
    const transport = await this.transportRepository.findOne({ where: { id }, relations: ['driver', 'vehicle'] });
    if (!transport) {
      throw new NotFoundException(`Transporte com id ${id} não encontrado`);
    }
    return transport;
  }

  /**
   * Atualiza os dados de um transporte existente.
   */
  async update(id: string, updateTransportDto: UpdateTransportDto): Promise<Transport> {
    const transport = await this.findOne(id);
    const { driverId, vehicleId, ...updateData } = updateTransportDto;

    if (driverId) {
      const driver = await this.driverRepository.findOne({ where: { id: driverId } });
      if (!driver) {
        throw new NotFoundException(`Motorista com id ${driverId} não encontrado`);
      }
      transport.driver = driver;
    }

    if (vehicleId) {
      const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
      if (!vehicle) {
        throw new NotFoundException(`Veículo com id ${vehicleId} não encontrado`);
      }
      transport.vehicle = vehicle;
    }

    Object.assign(transport, updateData);

    try {
      const updatedTransport = await this.transportRepository.save(transport);

      this.notificationsService.notify({
        type: 'UPDATE_TRANSPORT',
        id,
        data: updatedTransport,
      });

      return updatedTransport;
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar transporte: ${error.message}`);
    }
  }

  /**
   * Remove um transporte pelo seu UUID.
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.transportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transporte com id ${id} não encontrado`);
    }

    // Envia notificação para remoção de transporte
    this.notificationsService.notify({
      type: 'REMOVE_TRANSPORT',
      id,
    });

    return { message: 'Transporte removido com sucesso' };
  }
}
