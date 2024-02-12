import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MysqlTestConfig } from '../../common/config/mysql.config';

config();

const configService = new ConfigService({ app: { env: 'test' }, database: { mysqlPoolSize: 10 } });
const mysqlConfig = new MysqlTestConfig(configService);

const options: DataSourceOptions = {
  ...(mysqlConfig.createTypeOrmOptions() as DataSourceOptions),
  entities: ['src/common/entities/**/*{.ts,.js}'],
};

export default new DataSource(options);
