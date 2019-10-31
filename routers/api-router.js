const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router')
const usersRouter = require('./users-router')
const articlesRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const {getAvailableEndpoints} = require('../controllers/api-controller')
//const { send405Error } = require('../errors/error-handling')

apiRouter.route('/')
.get(getAvailableEndpoints)
//.all(send405Error)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;