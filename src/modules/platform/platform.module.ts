import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from '../../common/entities/platform/platform.entity';
import { PlatformService } from './platform.service';
import { PlatformRepository } from './platform.repository';
import { PlatformController } from './platform.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Platform])],
  providers: [PlatformService, PlatformRepository],
  exports: [TypeOrmModule, PlatformService],
  controllers: [PlatformController],
})
export class PlatformModule {}
