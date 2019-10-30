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


  //  return connection('comments').select('*').where({article_id}).then((result)=>
  //  return connection('articles').first('*').where({article_id}).join('co')
  //  console.log(result.length)
  // )
  //return connection('articles').first('*').where({article_id})
  
  
