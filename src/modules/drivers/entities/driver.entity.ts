// src/modules/drivers/entities/driver.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Vehicle } from 'src/modules/vehicles/entities/vehicle.entity';

export enum DriverApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'drivers' })
export class Driver {
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador único do motorista' })
  id: string;

  @Column({ comment: 'Nome do motorista' })
  name: string;

  @Column({ unique: true, comment: 'Email do motorista' })
  email: string;

  @Column({ nullable: true, comment: 'Telefone do motorista' })
  phone: string;

  @Column({ unique: true, comment: 'Número da carteira de motorista' })
  licenseNumber: string;

  // Relacionamento com veículos
  @OneToMany(() => Vehicle, vehicle => vehicle.driver)
  vehicles: Vehicle[];

  // Status de aprovação para o funil de validação
  @Column({
    type: 'enum',
    enum: DriverApprovalStatus,
    default: DriverApprovalStatus.PENDING,
    comment: 'Status de aprovação do motorista',
  })
  approvalStatus: DriverApprovalStatus;

  // Documentação enviada pelo motorista para validação (ex.: links ou dados dos documentos)
  @Column({ type: 'json', nullable: true, comment: 'Documentação fornecida pelo motorista para validação' })
  documents: any;

  // Campos de auditoria
  @Column({ comment: 'ID do usuário que criou o motorista' })
  createdBy: string;

  @Column({ nullable: true, comment: 'ID do usuário que atualizou o motorista pela última vez' })
  updatedBy?: string;

  @Column({ nullable: true, comment: 'ID do usuário que removeu o motorista' })
  removedBy?: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Data de remoção do motorista (soft delete)' })
  removedAt?: Date;

  @CreateDateColumn({ type: 'timestamp', comment: 'Data de criação do registro' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: 'Data de atualização do registro' })
  updatedAt: Date;
}
