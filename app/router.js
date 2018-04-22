/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app
  const islogin = middleware.islogin()
  const isadmin = middleware.isadmin()

  router.get('/', controller.home.index)

  router.get('/disney/friends', controller.disney.friends)

  router.get('/login', controller.user.login)
  router.get('/cos_auth', controller.user.cos_auth)

  router.get('/user', islogin, controller.user.user)
  router.put('/user', islogin, controller.user.update)
  router.get('/user/:userid', controller.user.info)
  router.get('/user/:userid/timesguides', controller.user.timesguides)
  router.get('/user/:userid/starteds', controller.user.starteds)
  router.get('/user/:userid/messages', controller.user.messages)
  router.get('/user/:userid/exchanges', controller.user.exchanges)
  router.get('/user/:userid/contributes', controller.user.contributes)

  router.get('/v1/rank', controller.rank.list)

  router.get('/v1/exchanges', controller.exchange.list)
  router.post('/v1/exchanges', islogin, controller.exchange.create)
  router.get('/v1/exchanges/:id', controller.exchange.id)
  router.put('/v1/exchanges/:id', islogin, controller.exchange.join)

  router.get('/v1/contributes', controller.contribute.list)
  router.get('/v1/contributes/:id', controller.contribute.id)
  router.delete('/v1/contributes/:id', islogin, controller.contribute.deleteId)
  router.post('/v1/contributes', islogin, controller.contribute.create)

  router.put('/admin/contributes/:id', isadmin, controller.contribute.active)

  router.get('/v1/upload/token', controller.upload.token)

  router.get('/v1/timesguides-children/:id', controller.timesguideChildren.id)
  router.get('/v1/timesguides-children', controller.timesguideChildren.list)
  router.get('/v1/timesguides', controller.timesguide.list)
  router.post('/v1/timesguides', islogin, controller.timesguide.create)
  router.get('/v1/timesguides/:id', controller.timesguide.id)
  router.get('/v1/timesguides/:id/starteds', controller.timesguide.starteds)
  router.put('/v1/timesguides/:id', islogin, controller.timesguide.uploadId)
}
