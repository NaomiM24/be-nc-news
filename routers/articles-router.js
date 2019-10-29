const articlesRouter = require('express').Router();
const { getArticleById } = require('../controllers/articles-controller')
const { send405Error } = require('../errors/error-handling')

articlesRouter.route('/:article_id').get(getArticleById).all(send405Error)

module.exports = articlesRouter