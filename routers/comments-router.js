const commentsRouter = require('express').Router();
const { patchCommentVotes, deleteCommentById } = require('../controllers/comments-controller')
const { send405Error } = require('../errors/error-handling')


commentsRouter.route('/:comment_id')
.patch(patchCommentVotes)
.delete(deleteCommentById)
.all(send405Error)

module.exports = commentsRouter