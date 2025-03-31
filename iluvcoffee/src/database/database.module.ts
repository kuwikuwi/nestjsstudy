// database.module.ts

import { Module, DynamicModule, Global } from '@nestjs/common'; // Global 추가 가능 (선택 사항)
import { DataSource, DataSourceOptions } from 'typeorm';

// DataSource 옵션을 주입하기 위한 토큰 (문자열이나 심볼 사용)
export const DATABASE_OPTIONS = 'DATABASE_OPTIONS';

// @Module 데코레이터는 보통 제거합니다 (Dynamic Module 패턴 사용 시)
// @Module({ ... }) // 이 부분 제거

@Global() // 필요하다면 전역 모듈로 만들어 어디서든 주입받기 쉽게 할 수 있습니다.
@Module({}) // 빈 모듈 데코레이터는 남겨둘 수 있습니다. (providers 등 정의 안함)
export class DatabaseModule {
  static register(options: DataSourceOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        // 1. DataSourceOptions를 값으로 제공하는 Provider (useFactory에서 주입받기 위해)
        {
          provide: DATABASE_OPTIONS,
          useValue: options,
        },
        // 2. DataSource 인스턴스를 생성하고 초기화하는 비동기 Factory Provider
        {
          provide: DataSource, // 혹은 'DATA_SOURCE' 같은 커스텀 토큰 사용 가능
          // inject: 주입받을 다른 Provider의 토큰 배열
          inject: [DATABASE_OPTIONS],
          // useFactory: 실제 인스턴스를 생성하는 함수 (async 가능)
          useFactory: async (dataSourceOptions: DataSourceOptions) => {
            const dataSource = new DataSource(dataSourceOptions);
            try {
              // DataSource 초기화 (비동기)
              await dataSource.initialize();
              console.log('Database DataSource initialized successfully.');
              return dataSource;
            } catch (error) {
              console.error('Error initializing Database DataSource:', error);
              throw error; // 에러를 다시 던져 애플리케이션 시작 실패를 알림
            }
          },
        },
      ],
      // DataSource Provider를 다른 모듈에서 사용할 수 있도록 exports에 추가
      exports: [DataSource], // 혹은 'DATA_SOURCE' 토큰 사용 시 해당 토큰
    };
  }
}