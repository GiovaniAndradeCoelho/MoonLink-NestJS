// src/modules/vehicles/entities/vehicle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Driver } from 'src/modules/drivers/entities/driver.entity';

@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador único do veículo' })
  id: string;

  @Column({ comment: 'Placa do veículo' })
  plate: string;

  @Column({ comment: 'Marca do veículo' })
  brand: string;

  @Column({ comment: 'Modelo do veículo' })
  model: string;

  @Column({ type: 'int', comment: 'Ano de fabricação do veículo' })
  year: number;

  @Column({ type: 'int', nullable: true, comment: 'Capacidade do veículo (ex: em kg ou metros cúbicos)' })
  capacity?: number;

  // Relacionamento: Cada veículo pode estar vinculado a um motorista.
  @ManyToOne(() => Driver, driver => driver.vehicles, { nullable: true })
  driver: Driver;

  @CreateDateColumn({ type: 'timestamp', comment: 'Data de criação do registro' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: 'Data de atualização do registro' })
  updatedAt: Date;
}
