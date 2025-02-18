// src/modules/drivers/drivers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, IsNull } from 'typeorm';
import { Driver, DriverApprovalStatus } from './entities/driver.entity';
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

  /**
   * Cria um novo motorista.
   * @param createDriverDto Dados para criação do motorista.
   * @param userId ID do usuário que está criando o motorista.
   */
  async create(createDriverDto: CreateDriverDto, userId: string): Promise<Driver> {
    try {
      const driver = this.driverRepository.create({
        ...createDriverDto,
        createdBy: userId,
      });
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

  /**
   * Retorna todos os motoristas que não foram removidos (soft delete).
   */
  async findAll(select?: string[]): Promise<Driver[]> {
    const options: FindManyOptions<Driver> = {
      where: { removedAt: IsNull() },
    };

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

    return await this.driverRepository.find(options);
  }

  /**
   * Retorna um motorista pelo seu UUID.
   */
  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id, removedAt: IsNull() },
      relations: ['vehicles'],
    });
    if (!driver) {
      throw new NotFoundException(`Motorista com id ${id} não encontrado`);
    }
    return driver;
  }

  /**
   * Atualiza um motorista existente.
   * @param id ID do motorista.
   * @param updateDriverDto Dados para atualização do motorista.
   * @param userId ID do usuário que está atualizando o motorista.
   */
  async update(id: string, updateDriverDto: UpdateDriverDto, userId: string): Promise<Driver> {
    const driver = await this.findOne(id);
    Object.assign(driver, updateDriverDto);
    driver.updatedBy = userId;
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

  /**
   * Realiza a remoção (soft delete) de um motorista.
   * @param id ID do motorista.
   * @param userId ID do usuário que está removendo o motorista.
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const driver = await this.findOne(id);
    driver.removedBy = userId;
    driver.removedAt = new Date();
    try {
      await this.driverRepository.save(driver);

      // Notificar remoção do motorista
      this.notificationsService.notify({
        type: 'DRIVER_REMOVED',
        data: { id, message: 'Motorista removido com sucesso' },
      });

      return { message: 'Motorista removido com sucesso' };
    } catch (error) {
      throw new BadRequestException(`Erro ao remover motorista: ${error.message}`);
    }
  }

  /**
   * Atribui um veículo ao motorista.
   * @param driverId ID do motorista.
   * @param vehicleId ID do veículo.
   */
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
   * @param driverId ID do motorista.
   * @param updateDriverDocumentsDto Dados para atualização dos documentos.
   * @param userId ID do usuário que está atualizando os documentos.
   */
  async updateDriverDocuments(driverId: string, updateDriverDocumentsDto: UpdateDriverDocumentsDto, userId: string): Promise<Driver> {
    const driver = await this.findOne(driverId);
    Object.assign(driver, updateDriverDocumentsDto);
    driver.updatedBy = userId;
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
