import { PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { AuditLog } from './audit-log';

export class Base extends AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdOn: Date;
}
