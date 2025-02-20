// src/modules/vehicles/vehicles.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { NotificationsService } from '../notifications/notifications/notifications.service';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly notificationsService: NotificationsService,
  ) { }

  /**
   * Creates a new vehicle.
   *
   * @param createVehicleDto - Data Transfer Object containing the vehicle creation data.
   * @returns A promise that resolves to the newly created vehicle.
   * @throws {BadRequestException} If there is an error during creation.
   */
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      const savedVehicle = await this.vehicleRepository.save(vehicle);

      // Notify about the creation of a new vehicle.
      try {
        this.notificationsService.notify({
          type: 'CREATE_VEHICLE',
          data: savedVehicle,
        });
      } catch (notifyError) {
        this.logger.error(
          `Notification error on vehicle creation: ${notifyError.message}`,
        );
      }

      return savedVehicle;
    } catch (error) {
      this.logger.error(`Error creating vehicle: ${error.message}`);
      throw new BadRequestException(`Error creating vehicle: ${error.message}`);
    }
  }

  /**
   * Retrieves all registered vehicles.
   *
   * @returns A promise that resolves to an array of vehicles.
   */
  async findAll(): Promise<Vehicle[]> {
    try {
      return await this.vehicleRepository.find();
    } catch (error) {
      this.logger.error(`Error retrieving vehicles: ${error.message}`);
      throw new BadRequestException(
        `Error retrieving vehicles: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves a vehicle by its unique identifier.
   *
   * @param id - The UUID of the vehicle.
   * @returns A promise that resolves to the vehicle.
   * @throws {NotFoundException} If the vehicle is not found.
   */
  async findOne(id: string): Promise<Vehicle> {
    try {
      const vehicle = await this.vehicleRepository.findOne({ where: { id } });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${id} not found`);
      }
      return vehicle;
    } catch (error) {
      this.logger.error(`Error retrieving vehicle: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates an existing vehicle.
   *
   * @param id - The UUID of the vehicle to update.
   * @param updateVehicleDto - Data Transfer Object containing the updated vehicle data.
   * @returns A promise that resolves to the updated vehicle.
   * @throws {NotFoundException} If the vehicle is not found.
   * @throws {BadRequestException} If there is an error during the update.
   */
  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    // Preload merges the existing entity with the new values.
    const vehicle = await this.vehicleRepository.preload({
      id,
      ...updateVehicleDto,
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    try {
      const updatedVehicle = await this.vehicleRepository.save(vehicle);

      // Notify about the update of the vehicle.
      try {
        this.notificationsService.notify({
          type: 'UPDATE_VEHICLE',
          data: updatedVehicle,
        });
      } catch (notifyError) {
        this.logger.error(
          `Notification error on vehicle update: ${notifyError.message}`,
        );
      }

      return updatedVehicle;
    } catch (error) {
      this.logger.error(`Error updating vehicle: ${error.message}`);
      throw new BadRequestException(`Error updating vehicle: ${error.message}`);
    }
  }

  /**
   * Removes a vehicle by its unique identifier.
   *
   * @param id - The UUID of the vehicle to remove.
   * @returns A promise that resolves to an object containing a success message.
   * @throws {NotFoundException} If the vehicle is not found.
   * @throws {BadRequestException} If there is an error during removal.
   */
  async remove(id: string): Promise<{ message: string }> {
    // Ensure the vehicle exists before attempting deletion.
    await this.findOne(id);
    try {
      const result = await this.vehicleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Vehicle with id ${id} not found`);
      }

      // Notify about the removal of the vehicle.
      try {
        this.notificationsService.notify({
          type: 'REMOVE_VEHICLE',
          data: { id, message: 'Vehicle successfully removed' },
        });
      } catch (notifyError) {
        this.logger.error(
          `Notification error on vehicle removal: ${notifyError.message}`,
        );
      }

      return { message: 'Vehicle successfully removed' };
    } catch (error) {
      this.logger.error(`Error removing vehicle: ${error.message}`);
      throw new BadRequestException(`Error removing vehicle: ${error.message}`);
    }
  }
}