'use strict';

const assert = require('assert');
// const cookie = require('cookie');
const mock = require('egg-mock');

describe('test/rsa.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/rsa-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it.skip('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, rsa')
      .expect(200);
  });

  it('should GET /test with query', async () => {
    const param = { username: '12138' };

    const paramPublicRsaStr = encodeURIComponent(app.rsaObj.publicKey.encrypt(
      JSON.stringify(param),
      'utf8',
      'base64'
    ));

    const reqObj = await app.httpRequest()
      .get(`/test?spayload=${paramPublicRsaStr}`)
      .set('content-type', 'application/json')
      .expect(200);


    const payload = reqObj.body.spayload;

    const bodyStr = app.rsaObj.publicKey.publicDecrypt(payload, 'base64', 'utf8');
    const body = JSON.parse(bodyStr);

    const expectdBody = [{
      userId: 1,
    }, {
      username: '12138',
    }];

    assert.deepEqual(body, expectdBody);
  });

  it('should POST /testPost with query', async () => {
    const param = { username: '12138', age: 1, filter: { where: { userId: 1 } } };
    const bodyInput = {
      payload: 'mysql',
      type: 'select',
      array: [{
        userId: 1,
      }],
    };

    // query
    const queryPublicRsaStr = encodeURIComponent(app.rsaObj.publicKey.encrypt(
      JSON.stringify(param),
      'utf8',
      'base64'
    ));

    // body
    const bodyPublicRsaStr = app.rsaObj.publicKey.encrypt(
      JSON.stringify(bodyInput),
      'utf8',
      'base64'
    );

    app.mockCsrf();
    const reqObj = await app.httpRequest()
      .post(`/testPost?spayload=${queryPublicRsaStr}`)
      .set('content-type', 'application/json')
      .send({
        spayload: bodyPublicRsaStr,
      })
      .expect(200);


    const payload = reqObj.body.spayload;

    const bodyStr = app.rsaObj.publicKey.publicDecrypt(payload, 'base64', 'utf8');
    const body = JSON.parse(bodyStr);

    const expectdBody = {
      query: 'o',
      username: '12138',
      type: 'select',
      array: [{
        userId: 1,
      }],
      age: 1,
    };

    assert.deepEqual(body, expectdBody);
  });
});
