// src/modules/drivers/dto/assign-vehicle.dto.ts
import { IsUUID } from 'class-validator';

export class AssignVehicleDto {
  @IsUUID()
  vehicleId: string;
}
