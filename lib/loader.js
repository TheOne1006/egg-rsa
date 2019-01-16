'use strict';

const ursa = require('ursa');

// const BASE64 = 'base64';
// const UTF8 = 'utf8'

module.exports = app => {
  const options = app.config.rsaWrap;

  if (!options.rsaPublicKey || !options.rsaPrivateKey) {
    throw new Error('undefined RSA Public Key OR RSA Private Key');
  }

  const ursaPrivateKey = ursa.createPrivateKey(options.rsaPrivateKey);
  const ursaPublicKey = ursa.createPublicKey(options.rsaPublicKey);

  // console.log('Encrypt with Public');

  // // base64 binary hex
  // let msg = ursaPublicKey.encrypt('Everything is going to be 200 OK🏃', 'utf8', 'base64');

  // console.log('encrypted', msg, '\n');

  // console.log('长度：');
  // console.log(unescape(encodeURIComponent(msg)).length);

  // console.log('Decrypt with Private');
  // msg = ursaPrivateKey.decrypt(msg, 'base64', 'utf8');
  // console.log('decrypted', msg, '\n');

  app.rsaObj = {
    privateKey: ursaPrivateKey,
    publicKey: ursaPublicKey,
  };
};
