import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { STRATEGY_JWT_AUTH } from '../constants';
import { Injectable } from '@nestjs/common';
import { AuthService, JWTPayload } from '../auth.service';
import { Users } from 'src/modules/users/entities/users.entity';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_AUTH) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    } as StrategyOptions);
  }
  async validate(payload: JWTPayload): Promise<Users> {
    return this.authService.getUserProfile(payload.sub);
  }
}
