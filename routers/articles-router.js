const articlesRouter = require('express').Router();
const { getArticleById, patchArticleVotes, postCommentToArticle } = require('../controllers/articles-controller')
const { send405Error } = require('../errors/error-handling')

articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleVotes).all(send405Error)

articlesRouter.route('/:article_id/comments').post(postCommentToArticle)

module.exports = articlesRouter