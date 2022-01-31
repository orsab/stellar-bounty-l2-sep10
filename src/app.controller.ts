import { Controller, Get, Header, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/.whell-known/stellar.toml')
  @Header('Content-Type', 'text/plain')
  @Header('access-control-allow-origin', '*')
  toml(): string {
    return this.appService.genTomlFile();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/securedContent')
  securedContent(@Request() req) {
    return req.user
  }
}
