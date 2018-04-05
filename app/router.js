/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/disney/friends', controller.exchange.friends);

  router.get('/login', controller.user.login);
  router.get('/cos_auth', controller.user.cos_auth);
  
  router.get('/user', controller.user.user);
  router.get('/user/:userid', controller.user.info)
  router.get('/user/:userid/timesguides', controller.user.timesguides)
  router.get('/user/:userid/starteds', controller.user.starteds)
  router.get('/user/:userid/messages', controller.user.messages)
  router.get('/user/:userid/contributes', controller.user.contributes)

  router.get('/v1/exchanges', controller.exchange.list);
  router.post('/v1/exchanges', controller.exchange.create);
  router.get('/v1/exchanges/:id', controller.exchange.id)
  router.post('/v1/exchanges/:tid', controller.exchange.deal)
  // router.post('/v1/exchanges/:id/users', controller.exchange.users)

  router.post('/v1/starteds', controller.started.create)
  router.post('/v1/contributes', controller.contribute.create)

  router.get('/v1/upload/token', controller.upload.token)

  router.get('/v1/timesguides', controller.timesguide.list)
  router.post('/v1/timesguides', controller.timesguide.create)
  router.get('/v1/timesguides/:id', controller.timesguide.id)
  router.get('/v1/timesguides/:id/starteds', controller.timesguide.starteds)
  router.put('/v1/timesguides/:id', controller.timesguide.uploadId)
}
