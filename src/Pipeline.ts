/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
// https://developer.atlassian.com/cloud/jira/platform/understanding-jwt-for-connect-apps/
// https://github.com/hokaccha/node-jwt-simple
// import token from "./Token";

async function pipeline(): Promise<string>{

    // auth Git pipelines Atlassian BitBucket

    let jwt = require('jwt-simple');
    let payload = { foo: 'bar' };
    let secret = require('./TokenAtlassian').token();
    // require('./credentials.json')['hosts']['password'];

// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
// let secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

// encode
    // let token = jwt.encode(payload, secret);

// decode
    // let decoded = jwt.decode(token, secret);
    // return decoded;
    return secret;
}

export default pipeline;