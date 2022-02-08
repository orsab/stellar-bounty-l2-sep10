import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService){}

  getHello(): string {
    return 'Hello World!';
  }

  genTomlFile(): string {
    return `VERSION = "${this.configService.get('toml.VERSION')}"

NETWORK_PASSPHRASE = "${this.configService.get('toml.NETWORK_PASSPHRASE')}"
SIGNING_KEY = "${this.configService.get('toml.SIGNING_KEY')}"
WEB_AUTH_ENDPOINT = "${this.configService.get('toml.WEB_AUTH_ENDPOINT')}"
TRANSFER_SERVER = "${this.configService.get('toml.TRANSFER_SERVER')}"
`
  }
}
