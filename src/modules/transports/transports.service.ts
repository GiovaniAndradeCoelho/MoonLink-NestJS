// src/modules/transports/transports.service.ts

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from './entities/transport.entity';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';
import { NotificationsService } from '../notifications/notifications/notifications.service';

/**
 * TransportsService handles the business logic for transport operations,
 * including creation, retrieval, update, and removal of transports.
 */
@Injectable()
export class TransportsService {
  private readonly logger = new Logger(TransportsService.name);

  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly notificationsService: NotificationsService,
  ) { }

  /**
   * Creates a new transport.
   *
   * @param createTransportDto - Data Transfer Object containing transport creation data.
   * @returns A promise that resolves to the created Transport.
   * @throws {BadRequestException} If an error occurs during creation.
   */
  async create(createTransportDto: CreateTransportDto): Promise<Transport> {
    try {
      const { driverId, vehicleId, ...transportData } = createTransportDto;
      const transport = this.transportRepository.create(transportData);

      // Associate driver if provided.
      if (driverId) {
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });
        if (!driver) {
          throw new NotFoundException(`Driver with id ${driverId} not found`);
        }
        transport.driver = driver;
      }

      // Associate vehicle if provided.
      if (vehicleId) {
        const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
        if (!vehicle) {
          throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
        }
        transport.vehicle = vehicle;
      }

      const savedTransport = await this.transportRepository.save(transport);

      // Notify about the transport creation.
      try {
        this.notificationsService.notify({
          type: 'CREATE_TRANSPORT',
          data: savedTransport,
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on transport creation: ${notifyError.message}`);
      }

      return savedTransport;
    } catch (error: any) {
      this.logger.error(`Error creating transport: ${error.message}`);
      throw new BadRequestException(`Error creating transport: ${error.message}`);
    }
  }

  /**
   * Retrieves all transports, including associated driver and vehicle data.
   *
   * @returns A promise that resolves to an array of Transport objects.
   */
  async findAll(): Promise<Transport[]> {
    try {
      return await this.transportRepository.find({ relations: ['driver', 'vehicle'] });
    } catch (error: any) {
      this.logger.error(`Error retrieving transports: ${error.message}`);
      throw new BadRequestException(`Error retrieving transports: ${error.message}`);
    }
  }

  /**
   * Retrieves a transport by its UUID.
   *
   * @param id - The UUID of the transport.
   * @returns A promise that resolves to the Transport.
   * @throws {NotFoundException} If the transport is not found.
   */
  async findOne(id: string): Promise<Transport> {
    try {
      const transport = await this.transportRepository.findOne({ where: { id }, relations: ['driver', 'vehicle'] });
      if (!transport) {
        throw new NotFoundException(`Transport with id ${id} not found`);
      }
      return transport;
    } catch (error: any) {
      this.logger.error(`Error retrieving transport with id ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates an existing transport.
   *
   * @param id - The UUID of the transport to update.
   * @param updateTransportDto - Data Transfer Object containing updated transport data.
   * @returns A promise that resolves to the updated Transport.
   * @throws {BadRequestException} If an error occurs during update.
   */
  async update(id: string, updateTransportDto: UpdateTransportDto): Promise<Transport> {
    const transport = await this.findOne(id);
    const { driverId, vehicleId, ...updateData } = updateTransportDto;

    // Update associated driver if driverId is provided.
    if (driverId) {
      const driver = await this.driverRepository.findOne({ where: { id: driverId } });
      if (!driver) {
        throw new NotFoundException(`Driver with id ${driverId} not found`);
      }
      transport.driver = driver;
    }

    // Update associated vehicle if vehicleId is provided.
    if (vehicleId) {
      const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
      }
      transport.vehicle = vehicle;
    }

    Object.assign(transport, updateData);

    try {
      const updatedTransport = await this.transportRepository.save(transport);

      // Notify about the transport update.
      try {
        this.notificationsService.notify({
          type: 'UPDATE_TRANSPORT',
          id,
          data: updatedTransport,
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on transport update: ${notifyError.message}`);
      }

      return updatedTransport;
    } catch (error: any) {
      this.logger.error(`Error updating transport with id ${id}: ${error.message}`);
      throw new BadRequestException(`Error updating transport: ${error.message}`);
    }
  }

  /**
   * Removes a transport by its UUID.
   *
   * @param id - The UUID of the transport to remove.
   * @returns A promise that resolves to an object containing a success message.
   * @throws {NotFoundException} If the transport is not found.
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.transportRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Transport with id ${id} not found`);
      }

      // Notify about the transport removal.
      try {
        this.notificationsService.notify({
          type: 'REMOVE_TRANSPORT',
          id,
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on transport removal: ${notifyError.message}`);
      }

      return { message: 'Transport successfully removed' };
    } catch (error: any) {
      this.logger.error(`Error removing transport with id ${id}: ${error.message}`);
      throw new BadRequestException(`Error removing transport: ${error.message}`);
    }
  }
}
