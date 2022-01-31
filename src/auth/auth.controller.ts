import { Body, Controller, Get, HttpStatus, Logger, LoggerService, Next, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthChallengeDto, AuthChallengeResponseDto, AuthGetTokenDto, AuthGetTokenResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Get()
  challenge(@Query() params: AuthChallengeDto): Promise<AuthChallengeResponseDto> {
    let challengeResp
    try {
      challengeResp = this.authService.genXDRTransaction(params);
    } catch (e) {
      this.logger.error(e)
    }

    return challengeResp
  }

  @Post()
  token(@Body() params: AuthGetTokenDto, @Res() res: Response): AuthGetTokenResponseDto {
    let challengeResp
    try {
      challengeResp = this.authService.genToken(params);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }

    res.status(HttpStatus.OK).json(challengeResp)
    
    return challengeResp
  }
}
