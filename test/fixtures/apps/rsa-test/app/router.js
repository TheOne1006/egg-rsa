'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/test', controller.home.test);
  router.post('/testPost', controller.home.testPost);

  router.get('/testIgnorePath', controller.home.testIgnorePath);
  router.get('/testIgnoreFunc', controller.home.testIgnoreFunc);
  router.get('/ignoreExportFunc', controller.home.ignoreExportFunc);
};
