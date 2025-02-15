// src/modules/drivers/dto/update-driver-documents.dto.ts
import { IsOptional, IsEnum, IsObject } from 'class-validator';
import { DriverApprovalStatus } from '../entities/driver.entity';

export class UpdateDriverDocumentsDto {
  @IsOptional()
  @IsObject({ message: 'documents deve ser um objeto JSON contendo os dados da documentação' })
  documents?: any;

  @IsOptional()
  @IsEnum(DriverApprovalStatus, { message: 'approvalStatus deve ser um dos seguintes valores: PENDING, APPROVED, REJECTED' })
  approvalStatus?: DriverApprovalStatus;
}
