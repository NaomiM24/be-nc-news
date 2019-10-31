const topicsRouter = require('express').Router();
const { getTopics, getTopicByTopicName } = require('../controllers/topics-controller')
const { send405Error } = require('../errors/error-handling')

topicsRouter.route('/')
.get(getTopics)
.all(send405Error)

topicsRouter.route('/:topic')
.get(getTopicByTopicName)
.all(send405Error)

module.exports = topicsRouter