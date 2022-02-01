import * as sdk from 'stellar-sdk';

class StellarHandler {
  static instance;
  private server;
  private custodian;

  constructor(server, custodian) {
    this.server = server;
    this.custodian = custodian;
  }

  static getInstance() {
    if (!this.instance) {
      const server = new sdk.Server(process.env.HORIZON_URL);
      let custodian;

      if (process.env.CUSTODIAN_WALLET) {
        custodian = sdk.Keypair.fromSecret(process.env.CUSTODIAN_WALLET);
      }
      this.instance = new StellarHandler(server, custodian);
    }
    return this.instance;
  }

  // async initCustomer(id) {
  //   const custodianAcc = await this.server.loadAccount(
  //     this.custodian.publicKey()
  //   );

  //   return new sdk.MuxedAccount(custodianAcc, String(id));
  // }

  validateAddress(address) {
    return (
      sdk.StrKey.isValidMed25519PublicKey(address) ||
      sdk.StrKey.isValidEd25519PublicKey(address)
    );
  }

  // async payToAddress(address, amount) {
  //   if (!this.validateAddress(address)) {
  //     throw new Error("Bad address supplied");
  //   }
  //   if (amount < 0.5) {
  //     throw new Error("Bad amount supplied (min 0.5)");
  //   }

  //   const custodianAcc = await this.server.loadAccount(
  //     this.custodian.publicKey()
  //   );

  //   const payment = sdk.Operation.payment({
  //     source: custodianAcc.accountId(),
  //     destination: address,
  //     asset: sdk.Asset.native(),
  //     amount: String(amount),
  //   });

  //   const tx = new sdk.TransactionBuilder(custodianAcc, {
  //     networkPassphrase: sdk.Networks.TESTNET,
  //     fee: sdk.BASE_FEE,
  //   })
  //     .addOperation(payment)
  //     .setTimeout(30)
  //     .build();

  //   tx.sign(sdk.Keypair.fromSecret(process.env.STELLAR_CUSTODIAN));
  //   return this.server.submitTransaction(tx);
  // }

  // async getMuxedAccount(id) {
  //   const custodianAcc = await this.server.loadAccount(
  //     this.custodian.publicKey()
  //   );
  //   return new sdk.MuxedAccount(custodianAcc, String(id));
  // }

  async getBalance(address) {
    const account = await this.server.loadAccount(address);

    return account.balances[0].balance;
  }
}

export default StellarHandler;
