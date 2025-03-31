import { Module } from '@nestjs/common';
import { CoffeesModule } from '../coffees/coffees.module'; // 경로 확인 필요
import { CoffeeRatingService } from './coffee-rating.service';
import { DatabaseModule } from '../database/database.module'; // 경로 확인 필요
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeOrmModule 추가 (Repository 사용 시)
// import { Coffee } from '../coffees/entities/coffee.entity'; // 예시 엔티티

@Module({
  imports: [
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'password',
    }),
    CoffeesModule,
    // 만약 CoffeeRatingService에서 Repository를 사용한다면 TypeOrmModule.forFeature 필요
    // TypeOrmModule.forFeature([Coffee])
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}