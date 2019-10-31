const { updateCommentVotes, removeCommentById} = require('../models/comments-model')


exports.patchCommentVotes = (req, res, next) => {
  const {comment_id} = req.params;
  const {inc_votes} = req.body
  //console.log(inc_votes)
  updateCommentVotes(comment_id, inc_votes).then(comment => {
   res.status(200).send({comment})
  }).catch(next)
}

exports.deleteCommentById = (req, res, next) => {
  const {comment_id} = req.params;
  removeCommentById(comment_id).then(() => {
    res.sendStatus(204)
  }).catch(next)
}