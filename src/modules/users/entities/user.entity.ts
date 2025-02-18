// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador único do usuário' })
  id: string;

  @Column({ comment: 'Nome do usuário' })
  name: string;

  @Column({ unique: true, comment: 'Email do usuário' })
  email: string;

  @Column({ comment: 'Senha do usuário' })
  password: string;

  @Column({ nullable: true, comment: 'Número de telefone do usuário' })
  phone?: string;

  @Column('text', {
    array: true,
    nullable: true,
    comment: 'Array de toasts permitidos para validação no websocket'
  })
  allowedToasts?: string[];

  // Campos para bloqueio e banimento
  @Column('boolean', { default: false, comment: 'Indica se o usuário está bloqueado' })
  isBlocked: boolean;

  @Column('text', { nullable: true, comment: 'Motivo do bloqueio' })
  blockReason?: string | null;

  @Column('boolean', { default: false, comment: 'Indica se o usuário está banido' })
  isBanned: boolean;

  @Column('text', { nullable: true, comment: 'Motivo do banimento' })
  banReason?: string | null;

  @CreateDateColumn({ type: 'timestamp', comment: 'Data de criação do registro' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: 'Data de atualização do registro' })
  updatedAt: Date;
}
