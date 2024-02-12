import { Exclude, Expose } from 'class-transformer';
import { Platform } from '../../../common/entities/platform/platform.entity';

export class PlatformResponseDto {
  @Exclude() private readonly _idx: string;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _symbol: string;
  @Exclude() private readonly _createdDate: Date;
  @Exclude() private readonly _updatedDate: Date;

  constructor({ idx, name, symbol, createdDate, updatedDate }: Platform) {
    this._idx = idx;
    this._name = name;
    this._symbol = symbol;
    this._createdDate = createdDate;
    this._updatedDate = updatedDate;
  }

  @Expose()
  get idx(): string {
    return this._idx;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  @Expose()
  get symbol(): string {
    return this._symbol;
  }

  @Expose()
  get createdDate(): Date {
    return this._createdDate;
  }

  @Expose()
  get updatedDate(): Date {
    return this._updatedDate;
  }
}
