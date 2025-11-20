import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurants/restaurants.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurants/service/restaurant.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RestaurantModule,
    RestaurantModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        database: config.get('DB_NAME'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        ssl:
          config.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        synchronize: false, // 개발할 땐 true
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RestaurantService],
})
export class AppModule {}
