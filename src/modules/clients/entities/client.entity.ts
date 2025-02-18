// src/modules/clients/entities/client.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Enum que define os tipos de cliente:
 * - INDIVIDUAL: Pessoa Física
 * - COMPANY: Pessoa Jurídica
 */
export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador único do cliente' })
  id: string;

  @Column({ comment: 'Nome do cliente' })
  name: string;

  @Column({ unique: true, comment: 'Email do cliente' })
  email: string;

  @Column({ nullable: true, comment: 'Telefone de contato do cliente' })
  phone: string;

  @Column({ nullable: true, comment: 'Endereço do cliente' })
  address: string;

  @Column({
    type: 'enum',
    enum: ClientType,
    default: ClientType.INDIVIDUAL,
    comment: 'Tipo de cliente: INDIVIDUAL (Pessoa Física) ou COMPANY (Pessoa Jurídica)',
  })
  clientType: ClientType;

  @Column({ nullable: true, comment: 'CPF, para pessoas físicas' })
  cpf: string;

  @Column({ nullable: true, comment: 'CNPJ, para pessoas jurídicas' })
  cnpj: string;

  @Column({ nullable: true, comment: 'Razão social, para pessoas jurídicas' })
  businessName: string;

  @Column({ nullable: true, comment: 'Inscrição estadual, para pessoas jurídicas' })
  stateRegistration: string;

  @Column({ nullable: true, comment: 'Website do cliente' })
  website: string;

  @Column({ nullable: true, type: 'text', comment: 'Observações adicionais sobre o cliente' })
  notes: string;

  // Campos de auditoria
  @Column({ comment: 'ID do usuário que criou o cliente' })
  createdBy: string;

  @Column({ nullable: true, comment: 'ID do usuário que atualizou o cliente pela última vez' })
  updatedBy?: string;

  @Column({ nullable: true, comment: 'ID do usuário que removeu o cliente' })
  removedBy?: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Data de remoção do cliente (soft delete)' })
  removedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamp', comment: 'Data de criação do registro' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: 'Data da última atualização do registro' })
  updatedAt: Date;
}
