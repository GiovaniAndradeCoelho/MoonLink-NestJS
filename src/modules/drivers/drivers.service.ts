// src/modules/drivers/drivers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverDocumentsDto } from './dto/update-driver-documents.dto';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';
import { NotificationsService } from '../notifications/notifications/notifications.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    try {
      const driver = this.driverRepository.create(createDriverDto);
      const savedDriver = await this.driverRepository.save(driver);

      // Notificar criação de motorista
      this.notificationsService.notify({
        type: 'DRIVER_CREATED',
        data: savedDriver,
      });

      return savedDriver;
    } catch (error) {
      throw new BadRequestException(`Erro ao criar motorista: ${error.message}`);
    }
  }

  async findAll(select?: string[]): Promise<Driver[]> {
    const options: FindManyOptions<Driver> = {};

    if (select && select.length > 0) {
      if (select.includes('vehicles')) {
        options.relations = ['vehicles'];
        select = select.filter(field => field !== 'vehicles');
      }

      if (select.length > 0) {
        options.select = select as (keyof Driver)[];
      }
    } else {
      options.relations = ['vehicles'];
    }

    const response = await this.driverRepository.find(options);
    return response;
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { id }, relations: ['vehicles'] });
    if (!driver) {
      throw new NotFoundException(`Motorista com id ${id} não encontrado`);
    }
    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findOne(id);
    Object.assign(driver, updateDriverDto);
    try {
      const updatedDriver = await this.driverRepository.save(driver);

      // Notificar atualização do motorista
      this.notificationsService.notify({
        type: 'DRIVER_UPDATED',
        data: updatedDriver,
      });

      return updatedDriver;
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar motorista: ${error.message}`);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const driver = await this.findOne(id);
    const result = await this.driverRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Motorista com id ${id} não encontrado`);
    }

    // Notificar remoção do motorista
    this.notificationsService.notify({
      type: 'DRIVER_REMOVED',
      data: { id, message: 'Motorista removido com sucesso' },
    });

    return { message: 'Motorista removido com sucesso' };
  }

  async assignVehicle(driverId: string, vehicleId: string): Promise<Driver> {
    const driver = await this.findOne(driverId);
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com id ${vehicleId} não encontrado`);
    }
    vehicle.driver = driver;
    await this.vehicleRepository.save(vehicle);
    const updatedDriver = await this.findOne(driverId);

    // Notificar atribuição de veículo ao motorista
    this.notificationsService.notify({
      type: 'DRIVER_VEHICLE_ASSIGNED',
      data: { driver: updatedDriver, vehicleId },
    });

    return updatedDriver;
  }

  /**
   * Atualiza a documentação e o status de aprovação do motorista.
   * Esse método representa uma etapa do funil de validação.
   */
  async updateDriverDocuments(driverId: string, updateDriverDocumentsDto: UpdateDriverDocumentsDto): Promise<Driver> {
    const driver = await this.findOne(driverId);
    Object.assign(driver, updateDriverDocumentsDto);
    try {
      const updatedDriver = await this.driverRepository.save(driver);

      // Notificar atualização dos documentos do motorista
      this.notificationsService.notify({
        type: 'DRIVER_DOCUMENTS_UPDATED',
        data: updatedDriver,
      });

      return updatedDriver;
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar documentação do motorista: ${error.message}`);
    }
  }
}
