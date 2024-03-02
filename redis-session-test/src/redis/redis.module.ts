import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

// 在 RedisModule 创建连接 redis 的 provider，导出 RedisService，并把这个模块标记为 @Global 模块
@Global()
@Module({
  providers: [RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            port: 6379,
            host: 'localhost'
          }
        })
        await client.connect()
        return client
      }
    }],
  exports: [RedisService]
})
export class RedisModule { }
