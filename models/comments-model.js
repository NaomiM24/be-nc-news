const connection = require("../connection")

exports.updateCommentVotes = (id, inc_votes) => {
  if (inc_votes){
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
      return comment
    })
  }
  return Promise.reject({
    status: 400,
    msg: "Invalid property on request body"
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