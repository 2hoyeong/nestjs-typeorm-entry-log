import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PlatformStatus } from './platform.constant';

@Entity()
export class Platform {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  idx: string;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: '플랫폼 이름' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: '플랫폼 심볼' })
  symbol: string;

  @Column({ type: 'boolean', nullable: false, comment: 'Utxo 사용 여부' })
  useUtxo: boolean;

  @Column({ type: 'boolean', nullable: false, comment: '수수료 주소 사용 여부' })
  useFeeAddress: boolean;

  @Column({ type: 'varchar', length: 255, default: PlatformStatus.Activated, comment: '플랫폼 상태' })
  status: PlatformStatus;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  static from(data: Partial<Platform>): Platform {
    const platform = new Platform();
    Object.assign(platform, data);
    return platform;
  }
}
