const connection = require("../db/connection")

exports.updateCommentVotes = (id, inc_votes = 0 ) => {
    return connection('comments')
    .where('comment_id', '=', id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(comment => {
      if (!comment[0]){
        return Promise.reject({
          status: 404,
          msg: "comment does not exist"
        })
      }
      return comment[0]
    })
  }

exports.removeCommentById = (id) => {
  return connection('comments')
  .where('comment_id', '=', id)
  .del()
  .then(delCount => {
    if (delCount === 0){
      return Promise.reject({
        status: 404,
        msg: 'comment does not exist'
      })
    }
  })
}