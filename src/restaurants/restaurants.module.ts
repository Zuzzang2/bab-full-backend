import { Module } from '@nestjs/common';
import { RestaurantService } from './service/restaurants.service';
import { RestaurantController } from './controller/restaurants.controller';

@Module({
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
