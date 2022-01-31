import { IsNotEmpty, IsOptional, Matches, IsBase64 } from 'class-validator';
import { IsStellarAddress, IsXDR } from 'src/validators';

export class AuthChallengeDto {
  @IsNotEmpty()
  @IsStellarAddress('account')
  account: string;

  @IsOptional()
  memo?: string;

  @IsOptional()
  home_domain?: string;

  @IsOptional()
  client_domain?: string;
}

export class AuthChallengeResponseDto {
  @IsNotEmpty()
  @IsBase64()
  transaction: string
  
  @IsOptional()
  network_passphrase?: string
}

export class AuthGetTokenDto {
  @IsNotEmpty()
  @IsXDR('transaction')
  transaction: string;
}

export class AuthGetTokenResponseDto {
  @IsNotEmpty()
  token: string;
}