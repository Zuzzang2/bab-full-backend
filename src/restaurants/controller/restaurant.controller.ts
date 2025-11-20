import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from '../service/restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(readonly restaurantService: RestaurantService) {}

  // 네이버 API로 모든 맛집 검색
  @Get('/search')
  searchAllRestaurants(
    @Query('title') title: string,
    @Query('page') page: string,
  ) {
    return this.restaurantService.searchAllRestaurants(title, Number(page));
  }
}
