import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleSeeder } from 'src/utils/seeders/role.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService, RoleSeeder],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
