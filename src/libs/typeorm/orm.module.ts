import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConfig } from '../../common/config/mysql.config';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: MysqlConfig })],
})
export class OrmModule {}
