import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import assert = require('assert');

@Injectable()
export class MysqlConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { env } = this.configService.get('app');
    assert.ok(env !== 'test', 'Cannot use MysqlConfig in test environment');

    const config = this.configService.get('database');
    return {
      type: 'mysql',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      timezone: 'Z',
      logging: false,
      synchronize: false,
      keepConnectionAlive: true,
      autoLoadEntities: true,
      extra: {
        connectionLimit: config.mysqlPoolSize,
      },
    };
  }
}

@Injectable()
export class MysqlTestConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { env } = this.configService.get('app');
    assert.ok(env === 'test', 'Cannot use MysqlTestConfig in non-test environment');

    const config = this.configService.get('database');
    return {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3310,
      username: 'root',
      password: 'test1234!',
      database: 'test_database',
      timezone: 'Z',
      logging: true,
      synchronize: true,
      keepConnectionAlive: true,
      autoLoadEntities: true,
      extra: {
        connectionLimit: config.mysqlPoolSize,
      },
    };
  }
}
