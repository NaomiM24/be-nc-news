const articlesRouter = require('express').Router();
const { getArticleById, patchArticleVotes, postCommentByArticleId, getCommentsByArticleId, getArticles } = require('../controllers/articles-controller')
const { send405Error } = require('../errors/error-handling')

articlesRouter.route('/')
.get(getArticles)

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleVotes)
.all(send405Error)

articlesRouter.route('/:article_id/comments')
.post(postCommentByArticleId)
.get(getCommentsByArticleId)
.all(send405Error)

module.exports = articlesRouter