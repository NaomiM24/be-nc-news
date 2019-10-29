const { fetchArticleById } = require('../models/articles-model')

exports.getArticleById = (req, res, next) => {
  
  const { article_id } = req.params
  fetchArticleById(article_id).then(article => {
    console.log(article[0])
    if (article[0]) res.status(200).send({article: article[0]})
  }).catch(next);
};