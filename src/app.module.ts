import { Module } from '@nestjs/common';
import { OrmModule } from './libs/typeorm/orm.module';
import { NestConfigModule } from './common/config/config.module';
import { PlatformModule } from './modules/platform/platform.module';

@Module({
  imports: [OrmModule, NestConfigModule, PlatformModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
