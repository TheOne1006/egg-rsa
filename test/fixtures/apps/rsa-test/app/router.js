'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/test', controller.home.test);
  router.post('/testPost', controller.home.testPost);
};
