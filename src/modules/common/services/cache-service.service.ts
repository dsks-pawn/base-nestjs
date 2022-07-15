import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async set(key: string, data: string, date: number): Promise<void> {
    await this.cacheManager.set(key, data, { ttl: date });
  }

  public get(key: string): Promise<string | undefined> {
    return this.cacheManager.get(key);
  }

  public del(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }

  public reset(): Promise<any> {
    return this.cacheManager.reset();
  }
}
