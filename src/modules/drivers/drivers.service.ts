// src/modules/drivers/drivers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverApprovalStatus } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverDocumentsDto } from './dto/update-driver-documents.dto';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    try {
      const driver = this.driverRepository.create(createDriverDto);
      return await this.driverRepository.save(driver);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar motorista: ${error.message}`);
    }
  }

  async findAll(): Promise<Driver[]> {
    return await this.driverRepository.find({ relations: ['vehicles'] });
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
      return await this.driverRepository.save(driver);
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar motorista: ${error.message}`);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.driverRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Motorista com id ${id} não encontrado`);
    }
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
    return await this.findOne(driverId);
  }

  /**
   * Atualiza a documentação e o status de aprovação do motorista.
   * Esse método representa uma etapa do funil de validação.
   */
  async updateDriverDocuments(driverId: string, updateDriverDocumentsDto: UpdateDriverDocumentsDto): Promise<Driver> {
    const driver = await this.findOne(driverId);
    Object.assign(driver, updateDriverDocumentsDto);
    try {
      return await this.driverRepository.save(driver);
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar documentação do motorista: ${error.message}`);
    }
  }
}