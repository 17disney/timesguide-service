/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/login', controller.user.login);
  router.get('/user', controller.user.user);
  router.get('/cos_auth', controller.user.cos_auth);

  router.get('/user/:userid/timesguides', controller.user.timesguides)
  router.get('/user/:userid', controller.user.user)

  router.get('/v1/exchanges', controller.exchange.list);
  // router.post('/v1/exchanges', controller.exchange.create);
  router.get('/v1/exchanges/:id', controller.exchange.id)
  router.post('/v1/exchanges/:tid', controller.exchange.deal)

  router.post('/v1/exchanges/:id/disney-friend', controller.exchange.disneyFirend)
  router.post('/v1/exchanges/:id/users', controller.exchange.users)

  router.post('/v1/starteds', controller.started.create)
  router.post('/v1/contributes', controller.contribute.create)

  router.get('/v1/upload/token', controller.upload.token)


  router.get('/timesguides', controller.timesguide.list)
  router.post('/timesguides', controller.timesguide.create)
  router.get('/timesguides/:id', controller.timesguide.id)
  router.put('/timesguides/:id', controller.timesguide.uploadId)
}
