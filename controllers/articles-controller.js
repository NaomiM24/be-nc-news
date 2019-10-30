const { fetchArticleById, updateArticleVotes } = require('../models/articles-model')

exports.getArticleById = (req, res, next) => {
  
  const { article_id } = req.params
  fetchArticleById(article_id).then(article => {
    if (article[0]) res.status(200).send({article: article[0]})
  }).catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const {article_id} = req.params;
  const {inc_votes} = req.body
  updateArticleVotes(article_id, inc_votes).then(article => {
    fetchArticleById(article[0].article_id).then(article => {
      res.status(200).send({article: article[0]})
    })
  }).catch(next);
}