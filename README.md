## Description

Stellar [SEP-10](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) example implementation, for this UI test you require to install [Rabet wallet](https://rabet.io/download)

1. Connect and accept wallet on this page
2. Send auth with Stellar wallet request
3. Sign and send signed XDR to the SEP-10 server
4. Now you'll receive JWT Auth bearer token for future activity

## Installation

```bash
$ cp .env.example .env
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

GoTo: http://localhost:3005 - UI

## License

[Apache2 licensed](LICENSE).
