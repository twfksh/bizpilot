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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        // host: configService.get<string>('DB_HOST'),
        // port: +configService.get('DB_PORT'),
        // username: configService.get<string>('DB_USER'),
        // password: configService.get<string>('DB_PASSWORD'),
        // database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    IdeasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
