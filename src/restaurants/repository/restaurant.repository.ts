import { Injectable } from '@nestjs/common';
import { RestaurantEntity } from '../entity/restaurant.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RestaurantRepository extends Repository<RestaurantEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RestaurantEntity, dataSource.createEntityManager());
  }
}
