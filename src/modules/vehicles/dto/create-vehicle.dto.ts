// src/modules/vehicles/dto/create-vehicle.dto.ts
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsInt()
  capacity?: number;
}
