// src/modules/transports/dto/create-transport.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { TransportType, TransportStatus } from '../entities/transport.entity';

export class CreateTransportDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(TransportType)
  type: TransportType;

  @IsEnum(TransportStatus)
  @IsOptional()
  status?: TransportStatus;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsDateString()
  @IsOptional()
  pickupDate?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  // IDs opcionais para associar motorista e veículo
  @IsUUID()
  @IsOptional()
  driverId?: string;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsString()
  @IsOptional()
  cargoDetails?: string;
}
