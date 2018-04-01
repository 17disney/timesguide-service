'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/login', controller.user.login);
  // router.get('/user', controller.user.info);
  // router.put('/user', controller.home.userEdit);

  router.get('/user/:id/timesguide', controller.timesguide.userList)
  router.put('/user/:id/timesguide/:tid', controller.timesguide.userUploadTid)

  // router.get('/exchange/list', controller.exchange.list);
  // router.get('/exchange/release', controller.exchange.release);
  // router.get('/exchange/demand', controller.exchange.demand);

  router.get('/timesguides/:local', controller.timesguide.list)
  router.get('/timesguide/:id', controller.timesguide.id)
  router.put('/timesguide/:id', controller.timesguide.uploadId)
  // router.get('/download/:id', controller.download.download);
}
