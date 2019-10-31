const { fetchArticleById, updateArticleVotes, addCommentByArticleId, fetchCommentsByArticleId, fetchArticles } = require('../models/articles-model')

exports.getArticleById = (req, res, next) => {
  
  const { article_id } = req.params
  fetchArticleById(article_id).then(article => {
    if (article[0]) res.status(200).send({article: article[0]})
  }).catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const {article_id} = req.params;
  const {inc_votes} = req.body
  //console.log(inc_votes)
  updateArticleVotes(article_id, inc_votes).then(article => {
    fetchArticleById(article[0].article_id).then(article => {
      res.status(200).send({article: article[0]})
    })
  }).catch(next);
}

exports.postCommentByArticleId = (req, res, next) => {
  const {article_id} = req.params;
  const comments = req.body;
  addCommentByArticleId(article_id, comments).then((comment) => {
    res.status(201).send({comment: comment[0].body})
  }).catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
  const {article_id} = req.params;
  const {sort_by, order} = req.query;
  fetchCommentsByArticleId(article_id, sort_by, order).then(comments => {
    res.status(200).send({comments})
  }).catch(next)
}

exports.getArticles = (req, res, next) =>{
  fetchArticles(req.query).then((articles)=>{
    console.log(articles)
    res.status(200).send({articles})
  }).catch(next)
}