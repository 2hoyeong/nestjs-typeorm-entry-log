import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { PlatformRepository } from './platform.repository';
import { Platform } from '../../common/entities/platform/platform.entity';
import { TypeOrmTestModule } from '../../app.test.helper';
import { PlatformStatus } from '../../common/entities/platform/platform.constant';
import { Repository } from 'typeorm';

describe('PlatformRepository', () => {
  let repository: PlatformRepository;
  let rootRepository: Repository<Platform>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmTestModule, TypeOrmModule.forFeature([Platform])],
      providers: [PlatformRepository],
    }).compile();
    repository = module.get<PlatformRepository>(PlatformRepository);
    rootRepository = module.get<Repository<Platform>>(getRepositoryToken(Platform));
  });

  describe('getPlatforms', () => {
    beforeAll(async () => {
      const testPlatforms = [
        Platform.from({
          name: '비트코인',
          symbol: 'BTC',
          useFeeAddress: false,
          useUtxo: true,
          status: PlatformStatus.Activated,
        }),
        Platform.from({
          name: '이더리움',
          symbol: 'ETH',
          useFeeAddress: true,
          useUtxo: false,
          status: PlatformStatus.Activated,
        }),
        Platform.from({
          name: '클레이튼',
          symbol: 'KLAY',
          useFeeAddress: true,
          useUtxo: false,
          status: PlatformStatus.Deactivated,
        }),
      ];

      await Promise.all(testPlatforms.map((platform) => repository.addPlatform(platform)));
    });

    afterAll(async () => {
      await rootRepository.clear();
    });

    it('ACTIVATED인 플랫폼만 가져온다.', async () => {
      const platforms = await repository.getPlatforms();
      expect(platforms).toEqual(
        expect.arrayContaining([expect.objectContaining({ status: PlatformStatus.Activated })]),
      );
    });
  });
});
