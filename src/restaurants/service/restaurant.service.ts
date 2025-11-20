import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from '../repository/restaurant.repository';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private config: ConfigService,
  ) {}
  async searchAllRestaurants(title: string, page: number = 1) {
    const naverClientId = this.config.get('X_NAVER_CLIENT_ID');
    const naverClientSecret = this.config.get('X_NAVER_CLIENT_SECRET');

    const url = `https://openapi.naver.com/v1/search/local.json`;

    const params = {
      query: `${title}`,
      display: 5,
      start: 1,
      sort: 'random',
    };

    const headers = {
      'X-Naver-Client-Id': naverClientId,
      'X-Naver-Client-Secret': naverClientSecret,
    };

    try {
      const { data } = await axios.get(url, { params, headers });
      return data;
    } catch (error) {
      console.error('네이버 API 호출 실패:', error.message);
      throw new Error('네이버 로컬 검색 실패');
    }
  }
}
