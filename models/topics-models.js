const connection = require("../db/connection")

exports.fetchTopics = () => {
  return connection
  .select('*').from('topics')
}

exports.fetchTopicByTopicName = (name) => {
  return connection('topics').first('*').where('slug', '=', name)
  .then(topic => {
    if (!topic)
      return Promise.reject({
      status: 404,
      msg: "topic does not exist"
    })
    return topic
  })
}