import { Column, CreateDateColumn } from 'typeorm';
import IAuditLog from './interfaces/audit-log.interface';

export class AuditLog implements IAuditLog {
  @CreateDateColumn()
  createdOn: Date;
  @Column({ nullable: true })
  modifiedOn: Date;
}
