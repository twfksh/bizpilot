import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/shared/dtos/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PassportLocalGuard } from 'src/shared/guards/passport-local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.authenticate(body);
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Body() body: LoginDto) {
    return this.authService.authenticate(body);
  }
}
