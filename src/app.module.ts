import { ApiModule } from '@Api/api.module';
import { ConfigModule } from '@Config/config.module';
import { DatabaseModule } from '@Database/database.module';
import { Module } from '@nestjs/common';
import { UtilModule } from '@Shared/util/module.util';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UtilModule,
    ApiModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
