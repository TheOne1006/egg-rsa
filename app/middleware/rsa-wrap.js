'use strict';

module.exports = options => {
  const middle = async (ctx, next) => {
    const rsaObj = ctx.app.rsaObj;
    console.log(options);

    // 解析query
    const paramPublicRsaStr = ctx.query && ctx.query.spayload || '';
    let extendQuery = {};
    if (paramPublicRsaStr) {
      try {
        const paramStr = rsaObj.privateKey.decrypt(paramPublicRsaStr, 'base64', 'utf8');
        // console.log(paramStr);
        extendQuery = JSON.parse(paramStr);
      } catch (error) {
        // ignore
        // console.error(error);
      }

      ctx.query = Object.assign(
        ctx.query,
        extendQuery
      );
    }

    // 解析body
    const bodyPublicRsaStr = ctx.request.body && ctx.request.body.spayload || '';
    let extendBody = {};

    if (bodyPublicRsaStr) {
      try {
        const bodayStr = rsaObj.privateKey.decrypt(bodyPublicRsaStr, 'base64', 'utf8');
        // console.log(bodayStr);
        extendBody = JSON.parse(bodayStr);
      } catch (error) {
        // ignore
        // console.error(error);
      }

      ctx.request.body = Object.assign(
        ctx.request.body,
        extendBody
      );
    }


    await next();

    const body = ctx.body;

    if (body) {
      const bodyJsonStr = JSON.stringify(body);
      const bodayStr = rsaObj.privateKey.privateEncrypt(bodyJsonStr, 'utf8', 'base64');
      ctx.body = {
        spayload: bodayStr,
      };
    }

  };
  return middle;
};
