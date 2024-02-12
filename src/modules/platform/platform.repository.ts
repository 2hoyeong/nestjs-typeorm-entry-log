import { Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from '../../common/entities/platform/platform.entity';
import { PlatformStatus } from '../../common/entities/platform/platform.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlatformRepository {
  constructor(
    @InjectRepository(Platform) private readonly repository: Repository<Platform>,
    private readonly configService: ConfigService,
  ) {}

  createQueryBuilder(alias = 'platform'): SelectQueryBuilder<Platform> {
    return this.repository.createQueryBuilder(alias).comment(this.configService.get('app.projectName'));
  }

  async addPlatform(platform: Platform): Promise<Platform> {
    return this.repository.save(platform);
  }

  async getAllPlatforms(): Promise<Platform[]> {
    const queryBuilder = this.createQueryBuilder().where('status = :status', { status: PlatformStatus.Activated });
    return queryBuilder.getMany();
  }
}
