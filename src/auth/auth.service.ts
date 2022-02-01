import { HttpStatus, Injectable, Logger, Next, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as sdk from 'stellar-sdk';

import { AuthChallengeDto, AuthChallengeResponseDto, AuthGetTokenDto, AuthGetTokenResponseDto } from './auth.dto';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import * as toml from 'toml';
import { lastValueFrom, Observable } from 'rxjs';
import * as assert from 'assert';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) { }

  getSigningKey(domain: string) {
    return this.httpService.get(`https://${domain}/.well-known/stellar.toml`)
      .pipe(
        map((response: AxiosResponse) => response.data),
        map((data: string) => toml.parse(data).SIGNING_KEY)
      );
  }

  /**
   * 
   * **AuthChallengeDto**
   * @param account - Stellar address
   * @param memo - (optional) memo field if exist
   * @param home_domain - (optional) adds an additional verification by the SIGNING_KEY, wrote inside the stellar.toml
   * @param client_domain - (optional) adds additional metadata into the challenge
   * @returns
   * **AuthChallengeResponseDto**
   * @param transaction - XDR base64 data
   * @param network_passphrase - indicate what network was used
   */
  async genXDRTransaction(input: AuthChallengeDto): Promise<AuthChallengeResponseDto> {
    let signing_key

    if(input.home_domain){
      signing_key = await lastValueFrom(this.getSigningKey(input.home_domain)).catch(e => {
        signing_key = undefined
      })
    }

    const transaction = sdk.Utils.buildChallengeTx(
      sdk.Keypair.fromSecret(this.configService.get('custodian')),
      input.account,
      input.client_domain || this.configService.get('homeDomain'),
      900,
      this.configService.get('toml.NETWORK_PASSPHRASE'),
      this.configService.get('homeDomain'),
      input.memo,
      input.client_domain,
      signing_key
    )

    const network_passphrase = this.configService.get('toml.NETWORK_PASSPHRASE')

    return {
      transaction,
      network_passphrase,
    };
  }

  checkSourceTransaction(tx:any){
    return tx.source === sdk.Keypair.fromSecret(this.configService.get('custodian')).publicKey()
  }
  checkFirstOperation(op:any){
    return op.type === 'manageData' && !!op.source
  }

  /**
   * 
   * **AuthGetTokenDto**
   * @param transaction - the base64 encoded signed challenge transaction XDR
   * @returns **AuthGetTokenResponseDto**
   * @param token - JWT token
   */
  genToken(input: AuthGetTokenDto): AuthGetTokenResponseDto {
    let parsed
    parsed = sdk.Utils.readChallengeTx(
      input.transaction,
      sdk.Keypair.fromSecret(this.configService.get('custodian')).publicKey(),
      this.configService.get('toml.NETWORK_PASSPHRASE'),
      this.configService.get('homeDomain'),
      this.configService.get('homeDomain'),
    );

    let client_domain
    const tx = parsed.tx

    const [firstOperation] = tx.operations

    // Signatures check: 
    // 1. exact 2 signatures
    // 2. custodian wallet signature
    // 3. customer wallet signature
    assert.ok(tx.signatures.length === 2, 'Not signed transaction received')
    const custodianKeyPair = sdk.Keypair.fromSecret(this.configService.get('custodian'))
    const customerKeyPair = sdk.Keypair.fromPublicKey(firstOperation.source)

    assert.ok(tx.signatures.some(s => {
      const match = custodianKeyPair.verify(tx.hash(), s._attributes.signature)
      return match
    }), 'Signature of custodian account not match')
    assert.ok(tx.signatures.some(s => {
      const match = customerKeyPair.verify(tx.hash(), s._attributes.signature)
      return match
    }), 'Signature of customer account not match')

    assert.ok(this.checkSourceTransaction(tx), 'Bad transaction source account')
    assert.ok(this.checkFirstOperation(firstOperation), 'First operation source account does not exist')

    const foundManagedData = tx.operations.find(o => o.type === 'manageData' && o.name === 'client_domain')
    if(foundManagedData){
      client_domain = foundManagedData.value
    }
    const JWTpayload: any = {
      iss: `https://${this.configService.get('homeDomain')}/auth?account=${parsed.clientAccountID}`,
      sub: tx.memo.value ? `${parsed.clientAccountID}:${tx.memo.value}` : parsed.clientAccountID,
      iat: Number(tx.timeBounds.minTime),
      exp: Number(tx.timeBounds.minTime) + 900
    }

    if(client_domain){
      JWTpayload.client_domain = client_domain
    }

    return {
      token: jwt.sign(JWTpayload, this.configService.get('jwtSecret')),
    }
  }

  async validateUser(accountId:string, sign:string){
    return true
  }
}
