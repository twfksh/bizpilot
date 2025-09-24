
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', minLength: 8, maxLength: 55, example: 'password123' })
    @IsString()
    @MinLength(8)
    @MaxLength(55)
    password: string;
}