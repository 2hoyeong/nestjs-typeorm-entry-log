import { Module } from '@nestjs/common';
import { NestConfigModule } from './common/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlTestConfig } from './common/config/mysql.config';

@Module({
  imports: [NestConfigModule, TypeOrmModule.forRootAsync({ useClass: MysqlTestConfig })],
})
export class TypeOrmTestModule {}
