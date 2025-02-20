// src/modules/drivers/drivers.service.ts

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, IsNull } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverDocumentsDto } from './dto/update-driver-documents.dto';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';
import { NotificationsService } from '../notifications/notifications/notifications.service';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Creates a new driver.
   *
   * @param createDriverDto - Data for creating the driver.
   * @param userId - ID of the user creating the driver.
   * @returns A promise that resolves to the created Driver.
   * @throws {BadRequestException} If an error occurs during creation.
   */
  async create(createDriverDto: CreateDriverDto, userId: string): Promise<Driver> {
    try {
      const driver = this.driverRepository.create({
        ...createDriverDto,
        createdBy: userId,
      });
      const savedDriver = await this.driverRepository.save(driver);

      // Notify driver creation
      try {
        this.notificationsService.notify({
          type: 'DRIVER_CREATED',
          data: savedDriver,
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on driver creation: ${notifyError.message}`);
      }

      return savedDriver;
    } catch (error) {
      this.logger.error(`Error creating driver: ${error.message}`);
      throw new BadRequestException(`Error creating driver: ${error.message}`);
    }
  }

  /**
   * Retrieves all drivers that have not been soft-deleted.
   *
   * @param select - Optional list of fields to select.
   * @returns A promise that resolves to an array of Drivers.
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

    try {
      return await this.driverRepository.find(options);
    } catch (error) {
      this.logger.error(`Error retrieving drivers: ${error.message}`);
      throw new BadRequestException(`Error retrieving drivers: ${error.message}`);
    }
  }

  /**
   * Retrieves a driver by its UUID.
   *
   * @param id - The UUID of the driver.
   * @returns A promise that resolves to the Driver.
   * @throws {NotFoundException} If the driver is not found.
   */
  async findOne(id: string): Promise<Driver> {
    try {
      const driver = await this.driverRepository.findOne({
        where: { id, removedAt: IsNull() },
        relations: ['vehicles'],
      });
      if (!driver) {
        throw new NotFoundException(`Driver with id ${id} not found`);
      }
      return driver;
    } catch (error) {
      this.logger.error(`Error retrieving driver: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates an existing driver.
   *
   * @param id - The UUID of the driver.
   * @param updateDriverDto - Data for updating the driver.
   * @param userId - ID of the user performing the update.
   * @returns A promise that resolves to the updated Driver.
   * @throws {NotFoundException} If the driver is not found.
   * @throws {BadRequestException} If an error occurs during the update.
   */
  async update(id: string, updateDriverDto: UpdateDriverDto, userId: string): Promise<Driver> {
    const driver = await this.findOne(id);
    Object.assign(driver, updateDriverDto);
    driver.updatedBy = userId;
    try {
      const updatedDriver = await this.driverRepository.save(driver);

      // Notify driver update
      try {
        this.notificationsService.notify({
          type: 'DRIVER_UPDATED',
          data: updatedDriver,
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on driver update: ${notifyError.message}`);
      }

      return updatedDriver;
    } catch (error) {
      this.logger.error(`Error updating driver: ${error.message}`);
      throw new BadRequestException(`Error updating driver: ${error.message}`);
    }
  }

  /**
   * Soft-deletes a driver.
   *
   * @param id - The UUID of the driver.
   * @param userId - ID of the user performing the removal.
   * @returns A promise that resolves to a success message.
   * @throws {NotFoundException} If the driver is not found.
   * @throws {BadRequestException} If an error occurs during removal.
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const driver = await this.findOne(id);
    driver.removedBy = userId;
    driver.removedAt = new Date();
    try {
      await this.driverRepository.save(driver);

      // Notify driver removal
      try {
        this.notificationsService.notify({
          type: 'DRIVER_REMOVED',
          data: { id, message: 'Driver successfully removed' },
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on driver removal: ${notifyError.message}`);
      }

      return { message: 'Driver successfully removed' };
    } catch (error) {
      this.logger.error(`Error removing driver: ${error.message}`);
      throw new BadRequestException(`Error removing driver: ${error.message}`);
    }
  }

  /**
   * Assigns a vehicle to a driver.
   *
   * @param driverId - The UUID of the driver.
   * @param vehicleId - The UUID of the vehicle.
   * @returns A promise that resolves to the updated Driver.
   * @throws {NotFoundException} If the driver or vehicle is not found.
   * @throws {BadRequestException} If an error occurs during assignment.
   */
  async assignVehicle(driverId: string, vehicleId: string): Promise<Driver> {
    const driver = await this.findOne(driverId);
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
    }
    vehicle.driver = driver;
    try {
      await this.vehicleRepository.save(vehicle);
      const updatedDriver = await this.findOne(driverId);

      // Notify vehicle assignment to driver
      try {
        this.notificationsService.notify({
          type: 'DRIVER_VEHICLE_ASSIGNED',
          data: { driver: updatedDriver, vehicleId },
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on driver vehicle assignment: ${notifyError.message}`);
      }

      return updatedDriver;
    } catch (error) {
      this.logger.error(`Error assigning vehicle to driver: ${error.message}`);
      throw new BadRequestException(`Error assigning vehicle to driver: ${error.message}`);
    }
  }

  /**
   * Updates a driver's documents and approval status.
   *
   * @param driverId - The UUID of the driver.
   * @param updateDriverDocumentsDto - Data for updating driver documents.
   * @param userId - ID of the user updating the documents.
   * @returns A promise that resolves to the updated Driver.
   * @throws {NotFoundException} If the driver is not found.
   * @throws {BadRequestException} If an error occurs during the update.
   */
  async updateDriverDocuments(
    driverId: string,
    updateDriverDocumentsDto: UpdateDriverDocumentsDto,
    userId: string,
  ): Promise<Driver> {
    const driver = await this.findOne(driverId);
    Object.assign(driver, updateDriverDocumentsDto);
    driver.updatedBy = userId;
    try {
      const updatedDriver = await this.driverRepository.save(driver);

      // Notify document update for driver
      try {
        this.notificationsService.notify({
          type: 'DRIVER_DOCUMENTS_UPDATED',
          data: updatedDriver,
        });
      } catch (notifyError) {
        this.logger.error(`Notification error on driver documents update: ${notifyError.message}`);
      }

      return updatedDriver;
    } catch (error) {
      this.logger.error(`Error updating driver documents: ${error.message}`);
      throw new BadRequestException(`Error updating driver documents: ${error.message}`);
    }
  }
}
