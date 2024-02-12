import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformResponseDto } from './dtos/platform-response.dto';

@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPlatforms(): Promise<PlatformResponseDto[]> {
    const platforms = await this.platformService.getAllPlatforms();
    return platforms.map((platform) => new PlatformResponseDto(platform));
  }
}
