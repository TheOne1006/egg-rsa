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
  outEncoding: 'base64',
  bufEncoding: 'utf8',
  ignoreExport: () => false, // (ctx) => false
};
