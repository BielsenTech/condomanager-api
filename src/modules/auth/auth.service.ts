import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async loginWithCredentials(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
    
    const user = await this.userService.create(registerDto);
    const { password, ...result } = user;
    return this.login(result);
  }

  async validateGoogleUser(profile: any) {
    let user = await this.userService.findByGoogleId(profile.id);
    
    if (!user) {
      user = await this.userService.findByEmail(profile.email);
      
      if (user) {
        // Update existing user with Google ID
        user = await this.userService.update(user.id, { googleId: profile.id });
      } else {
        // Create new user
        user = await this.userService.create({
          email: profile.email,
          name: profile.displayName,
          googleId: profile.id,
          avatarUrl: profile.picture,
        });
      }
    }
    
    const { password, ...result } = user;
    return result;
  }

  async validateDiscordUser(profile: any) {
    let user = await this.userService.findByDiscordId(profile.id);
    
    if (!user) {
      user = await this.userService.findByEmail(profile.email);
      
      if (user) {
        // Update existing user with Discord ID
        user = await this.userService.update(user.id, { discordId: profile.id });
      } else {
        // Create new user
        user = await this.userService.create({
          email: profile.email,
          name: profile.username,
          discordId: profile.id,
          avatarUrl: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : undefined,
        });
      }
    }
    
    const { password, ...result } = user;
    return result;
  }
} 