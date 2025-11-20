import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly PREFIX = 'refresh_token:';
  private readonly REFRESH_TOKEN_TTL: number;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private config: ConfigService,
  ) {
    // String -> Number 변환
    this.REFRESH_TOKEN_TTL = Number(this.config.get('REFRESH_TOKEN_TTL'));
  }

  // 1. Refresh Token 저장
  async setRefreshToken(
    userId: number,
    token: string,
    ttl: number = this.REFRESH_TOKEN_TTL,
  ): Promise<void> {
    try {
      const key = this.PREFIX + userId;
      await this.redis.set(key, token, 'EX', ttl);
      this.logger.debug(
        `Refresh Token 저장 성공(userId=${userId}, TTL=${ttl}s)`,
      );
    } catch (error) {
      this.logger.error(
        `Refresh Token 저장 실패 (userId=${userId}): ${error.message}`,
      );
      throw error;
    }
  }

  // 2. Refresh Token 조회
  async getRefreshToken(userId: number): Promise<string | null> {
    try {
      const key = this.PREFIX + userId;
      const token = await this.redis.get(key);
      this.logger.debug(
        `Refresh Token 조회 (userId=${userId}, exists=${!!token})`,
      );
      return token;
    } catch (error) {
      this.logger.error(
        `Refresh Token 조회 실패 (userId=${userId}): ${error.message}`,
      );
      return null;
    }
  }

  // 3. Refresh Token 삭제
  async removeRefreshToken(userId: number): Promise<void> {
    try {
      const key = this.PREFIX + userId;
      await this.redis.del(key);
      this.logger.debug(`Refresh Token 삭제 (userId=${userId})`);
    } catch (error) {
      this.logger.error(
        `Refresh Token 삭제 실패 (userId=${userId}): ${error.message}`,
      );
      throw error;
    }
  }

  // 4. TTL 조회 (남은 수명)
  async getRefreshTokenTTL(userId: number): Promise<number> {
    try {
      const key = this.PREFIX + userId;
      const ttl = await this.redis.ttl(key);
      this.logger.debug(`TTL 확인 (userId=${userId}, ttl=${ttl})`);
      return ttl;
    } catch (error) {
      this.logger.error(`Redis ttl 실패 (userId=${userId}): ${error.message}`);
      return -2; // 키 없음으로 간주
    }
  }
}
