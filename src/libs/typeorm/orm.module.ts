import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConfig } from '../../common/config/mysql.config';
import { EntryPointLoggingModule } from './entry-point-logging.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: MysqlConfig }), EntryPointLoggingModule.forRoot()],
})
export class OrmModule {}
