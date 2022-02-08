export default () => ({
    toml: {
        VERSION: process.env.TOML_VERSION,
        NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE,
        SIGNING_KEY: process.env.SIGNING_KEY,
        WEB_AUTH_ENDPOINT: process.env.WEB_AUTH_ENDPOINT,
        TRANSFER_SERVER: process.env.TRANSFER_SERVER,
    },
    custodian: process.env.CUSTODIAN_WALLET,
    homeDomain: process.env.HOME_DOMAIN,
    jwtSecret: process.env.JWT_SECRET,
    horizonServer: process.env.HORIZON_URL
});