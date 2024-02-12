import { Injectable } from '@nestjs/common';
import { PlatformRepository } from './platform.repository';
import { Platform } from '../../common/entities/platform/platform.entity';

@Injectable()
export class PlatformService {
  constructor(private readonly platformRepository: PlatformRepository) {}

  async getAllPlatforms(): Promise<Platform[]> {
    return this.platformRepository.getPlatforms();
  }
}
