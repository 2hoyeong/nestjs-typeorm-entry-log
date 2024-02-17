import { Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from '../../common/entities/platform/platform.entity';
import { PlatformStatus } from '../../common/entities/platform/platform.constant';

@Injectable()
export class PlatformRepository {
  constructor(@InjectRepository(Platform) private readonly repository: Repository<Platform>) {}

  createQueryBuilder(alias = 'platform'): SelectQueryBuilder<Platform> {
    return this.repository.createQueryBuilder(alias);
  }

  async addPlatform(platform: Platform): Promise<Platform> {
    return this.repository.save(platform);
  }

  async getPlatforms(): Promise<Platform[]> {
    const queryBuilder = this.createQueryBuilder().where('status = :status', { status: PlatformStatus.Activated });
    return queryBuilder.getMany();
  }
}
