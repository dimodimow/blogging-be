import IAuditLog from './types/audit-log.interface';
import { Column, CreateDateColumn } from 'typeorm';

export class AuditLog implements IAuditLog {
  @CreateDateColumn()
  createdOn: Date;
  @Column({ nullable: true })
  modifiedOn: Date;
}
