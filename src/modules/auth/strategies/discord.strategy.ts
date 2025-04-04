import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

interface DiscordStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: string[];
}

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const options: DiscordStrategyOptions = {
      clientID: configService.get<string>('DISCORD_CLIENT_ID') || '',
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('DISCORD_CALLBACK_URL') || '',
      scope: ['identify', 'email'],
    };
    
    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      avatar: profile.avatar,
    };

    return this.authService.validateDiscordUser(user);
  }
} 