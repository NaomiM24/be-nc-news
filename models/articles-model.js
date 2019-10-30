const connection = require("../connection")

// exports.fetchArticles = () => {
//   return connection
//   .select('*').from('users')
// }

exports.fetchArticleById = (article_id) => {
  return connection
  .select('articles.*')
  .from('articles')
  .where('articles.article_id', '=', article_id)
  .count({comment_count: 'comment_id'})
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
  .then(article => {
    if (!article[0])
      return Promise.reject({
      status: 404,
      msg: "article does not exist"
    })
    return article
  })
}
exports.updateArticleVotes = (id, inc_votes) => {
  if (inc_votes){
    return connection('articles')
  .where('article_id', '=', id)
  .increment('votes', inc_votes)
  .returning('*')
  .then(article => {
    if (!article[0])
      return Promise.reject({
      status: 404,
      msg: "article does not exist"
    })
    return article
  });
}
return Promise.reject({
  status: 400,
  msg: "Invalid property on request body"
})
}

exports.addCommentByArticleId = (id, comment) => {
  if (comment.hasOwnProperty('username') && comment.hasOwnProperty('body')){
    let newComment = {}
    newComment.article_id = id
    newComment.author = comment.username
    newComment.body = comment.body
    return connection('comments')
    .insert(newComment)
    .returning('*')
  }
  return Promise.reject({
    status: 400,
    msg: "Missing property on request body"
  })
}

exports.fetchCommentsByArticleId = (id, sort_by = 'created_at', order = 'desc') => {
  if (order === 'asc' || order === 'desc'){
  return connection
  .select('*')
  .from('comments')
  .orderBy(sort_by, order)
  .where('article_id', '=', id)
  .then(comments => {
    if (!comments[0])
    return Promise.reject({
      status: 404,
      msg: "article does not exist"
    })
    return comments
  });
}
return Promise.reject({
  status: 400,
  msg: "Order method not approved"
})
}


exports.fetchArticles = ({sort_by = 'created_at', order = 'desc'}) => {
  if (order === 'asc' || order === 'desc'){
  return connection
  .select('articles.article_id', 'title', 'topic', 'articles.author', 'articles.created_at')
  .from('articles')
  .orderBy(sort_by, order)
  .count({comment_count: 'comment_id' })
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
    }
  return Promise.reject({
      status: 400,
      msg: "Order method not approved"
    }) 
}
