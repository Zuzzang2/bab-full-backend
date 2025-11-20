import { Module } from '@nestjs/common';
import { RestaurantService } from './service/restaurant.service';
import { RestaurantController } from './controller/restaurant.controller';
import { RestaurantRepository } from './repository/restaurant.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './entity/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [RestaurantService, RestaurantRepository],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
