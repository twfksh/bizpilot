
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://example.com/avatar.png' })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ description: 'User password', minLength: 8, example: 'password123' })
    @IsString()
    password: string;
}
