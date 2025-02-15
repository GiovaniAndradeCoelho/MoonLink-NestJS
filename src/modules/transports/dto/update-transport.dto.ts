import { PartialType } from '@nestjs/mapped-types';
import { CreateTransportDto } from './create-transport.dto';

export class UpdateTransportDto extends PartialType(CreateTransportDto) {}
