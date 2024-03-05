import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';

@Global()
@Module({
  controllers: [RedisController],
  providers: [RedisService, {
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
