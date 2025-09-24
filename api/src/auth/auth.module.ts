import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController, PassportAuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController, PassportAuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
