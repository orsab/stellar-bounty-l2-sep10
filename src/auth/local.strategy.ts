import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(accountId:string, sign:string): Promise<any> {
    console.log(accountId,sign)
    const user = await this.authService.validateUser(accountId, sign);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}