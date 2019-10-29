const connection = require("../connection")

exports.fetchTopics = () => {
  return connection
  .select('*').from('topics')
}