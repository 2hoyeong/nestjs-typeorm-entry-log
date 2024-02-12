import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { appConfig, appConfigValidationSchema } from './configs/app.config';
import { databaseConfig, databaseConfigValidationSchema } from './configs/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env`],
      load: [databaseConfig, appConfig],
      cache: true,
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        ...databaseConfigValidationSchema,
        ...appConfigValidationSchema,
      }),
      validationOptions: {
        abortEarly: true,
        debug: true,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class NestConfigModule {}
