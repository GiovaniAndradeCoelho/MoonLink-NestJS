// src/modules/vehicles/vehicles.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  /**
   * Cria um novo veículo.
   */
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      return await this.vehicleRepository.save(vehicle);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar veículo: ${error.message}`);
    }
  }

  /**
   * Retorna todos os veículos cadastrados.
   */
  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }

  /**
   * Retorna um veículo pelo seu UUID.
   */
  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com id ${id} não encontrado`);
    }
    return vehicle;
  }

  /**
   * Atualiza os dados de um veículo existente.
   */
  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    try {
      return await this.vehicleRepository.save(vehicle);
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar veículo: ${error.message}`);
    }
  }

  /**
   * Remove um veículo pelo seu UUID.
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.vehicleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Veículo com id ${id} não encontrado`);
    }
    return { message: 'Veículo removido com sucesso' };
  }
}
