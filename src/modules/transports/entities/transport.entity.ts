// src/modules/transports/entities/transport.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';

export enum TransportType {
  FREIGHT = 'FREIGHT',
  LAST_MILE = 'LAST_MILE',
  FTL = 'FTL',
  LTL = 'LTL'
}

export enum TransportStatus {
  SCHEDULED = 'SCHEDULED',    // Agendado
  IN_TRANSIT = 'IN_TRANSIT',  // Em trânsito
  DELIVERED = 'DELIVERED',    // Entregue
  CANCELLED = 'CANCELLED'     // Cancelado
}

@Entity({ name: 'transports' })
export class Transport {
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador único do transporte' })
  id: string;

  @Column({ unique: true, comment: 'Código do transporte' })
  code: string;

  @Column({
    type: 'enum',
    enum: TransportType,
    default: TransportType.FREIGHT,
    comment: 'Tipo de transporte'
  })
  type: TransportType;

  @Column({
    type: 'enum',
    enum: TransportStatus,
    default: TransportStatus.SCHEDULED,
    comment: 'Status do transporte'
  })
  status: TransportStatus;

  @Column({ comment: 'Endereço de coleta', nullable: true })
  pickupAddress: string;

  @Column({ comment: 'Endereço de entrega', nullable: true })
  deliveryAddress: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Data e hora da coleta' })
  pickupDate: Date;

  @Column({ type: 'timestamp', nullable: true, comment: 'Data e hora da entrega' })
  deliveryDate: Date;

  @ManyToOne(() => Driver, { nullable: true })
  driver: Driver;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle: Vehicle;

  @Column({ type: 'text', nullable: true, comment: 'Detalhes da carga ou observações' })
  cargoDetails: string;

  @CreateDateColumn({ type: 'timestamp', comment: 'Data de criação do registro' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: 'Data de atualização do registro' })
  updatedAt: Date;
}
