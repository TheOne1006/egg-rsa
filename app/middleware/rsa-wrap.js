'use strict';

module.exports = options => {
  const middle = async (ctx, next) => {
    const rsaObj = ctx.app.rsaObj;
    const ignorePaths = options.ignorePaths;
    const ignoreFunction = options.ignore;
    const ignoreExportFunc = options.ignoreExport;

    let ignoreParse = false;
    let ignoreExport = false;

    const ignorePathsLen = ignorePaths.length;

    for (let index = 0; index < ignorePathsLen; index++) {
      const path = ignorePaths[index];
      const isStr = typeof path === 'string';
      if (isStr && path === ctx.path) {
        ignoreParse = true;
        ignoreExport = true;
        break;
      }

      const isReg = path instanceof RegExp;
      if (isReg && path.test(ctx.path)) {
        ignoreParse = true;
        ignoreExport = true;
        break;
      }
    }

    // 没有修改, 执行 ignoreFunction
    if (!ignoreParse && !ignoreExport) {
      const allIgnore = await ignoreFunction(ctx);
      if (allIgnore) {
        ignoreParse = true;
        ignoreExport = true;
      }
    }

    if (!ignoreExport) {
      ignoreExport = await ignoreExportFunc(ctx);
    }

    if (!ignoreParse) {
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

      let extendBody = {};
      // 解析body
      const bodyPublicRsaStr = ctx.request.body && ctx.request.body.spayload || '';

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
    }

    await next();

    // console.log(ctx.body);

    const body = ctx.body;

    if (body && !ignoreExport) {
      const bodyJsonStr = JSON.stringify(body);
      const bodayStr = rsaObj.privateKey.privateEncrypt(bodyJsonStr, 'utf8', 'base64');
      ctx.body = {
        spayload: bodayStr,
      };
    }

  };
  return middle;
};
