'use strict';

/**
 * egg-rsa default config
 * @member Config#rsa
 * @property {String} SOME_KEY - some description
 */
exports.rsaWrap = {
  ignorePaths: [ '/' ],
  ignore: () => true, // (ctx) => true
  rsaPrivateKey: '',
  rsaPublicKey: '',
  ignoreExport: () => false, // (ctx) => false
};
