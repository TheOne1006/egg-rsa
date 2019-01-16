'use strict';

const fs = require('fs');
const path = require('path');


module.exports = app => {
  const rsaPrivateFilePath = path.join(app.root, 'config', 'key', 'rsa_private_key.pem');
  const rsaPublicFilePath = path.join(app.root, 'config', 'key', 'rsa_public_key.pem');
  const rsaPrivateKey = fs.readFileSync(rsaPrivateFilePath, 'utf8');
  const rsaPublicKey = fs.readFileSync(rsaPublicFilePath, 'utf8');


  const config = {
    rsaWrap: {
      ignorePath: [],
      matchFunction: () => true,
      rsaPrivateKey,
      rsaPublicKey,
    },
  };

  config.middleware = [
    'rsaWrap',
  ];

  return config;
};
