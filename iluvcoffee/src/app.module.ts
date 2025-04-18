// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
// import { DatabaseModule } from './database/database.module'; // <--- 이 줄 삭제 또는 주석 처리
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './config/app.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig]
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5432),
      // }),
    }),
    CoffeesModule,
    TypeOrmModule.forRootAsync({ // 비동기로 변수들의 값을 가져오는 것
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({

          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'production',
        }),
    }),
    CoffeeRatingModule,
    // DatabaseModule, // <--- 만약 이 줄도 있다면 삭제 또는 주석 처리
    // DatabaseModule.register({ ... }), // <--- 만약 이런 호출이 있다면 삭제
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}