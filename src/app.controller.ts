import { Controller, Get, Header, Request, Response, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import Stellar from './util/stellar'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/.well-known/stellar.toml')
  @Header('Content-Type', 'text/plain')
  @Header('access-control-allow-origin', '*')
  toml(): string {
    return this.appService.genTomlFile();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/sep6/info')
  async securedContent(@Request() req, @Response() res) {
    const sdk = Stellar.getInstance()
    if(!sdk.validateAddress(req.user.accountId)){
      res.status(400).json({error: 'Bad stellar address'})
    }
    const balance = await sdk.getBalance(req.user.accountId)

    res.status(200).json({
      ...req.user,
      balance
    })
  }
}
