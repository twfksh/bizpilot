import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdeasModule } from './ideas/ideas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get<string>('DB_URL'),
          ssl: { rejectUnauthorized: false },
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    UsersModule,
    AuthModule,
    IdeasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
