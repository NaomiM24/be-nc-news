const { fetchTopics, fetchTopicByTopicName } = require('../models/topics-models')

exports.getTopics = (req, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({topics})
  })
}

exports.getTopicByTopicName = (req, res, next) => {
  const {topic} = req.params
  fetchTopicByTopicName(topic).then(topic => {
    if (topic) res.status(200).send({topic})
  }).catch(next);
}