import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Google ID for OAuth' })
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional({ description: 'Discord ID for OAuth' })
  @IsString()
  @IsOptional()
  discordId?: string;

  @ApiPropertyOptional({ description: 'URL to user avatar' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Role of the user', enum: UserRole, default: UserRole.RESIDENT })
  @IsOptional()
  role?: UserRole;
} 