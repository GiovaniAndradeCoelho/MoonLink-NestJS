// src/modules/drivers/dto/create-driver.dto.ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;
}
