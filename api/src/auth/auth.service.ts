import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

type AuthInput = {
  email: string;
  password: string;
};

type SignInData = {
  userId: string;
  email: string;
};

type AuthResult = {
  accessToken: string;
  userId: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async register(createUserDto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create(createUserDto);
    const { password, ...userData } = user;

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: userData };
  }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signIn(user.userId, user.email);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findByEmail(input.email);
    if (user && await bcrypt.compare(input.password, user.password)) {
      const { id, email } = user;
      return { userId: id, email };
    }
    return null;
  }

  async signIn(userId: string, email: string): Promise<AuthResult> {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, userId, email };
  }
}
