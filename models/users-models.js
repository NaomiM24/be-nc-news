const connection = require("../connection")

exports.fetchUsers = () => {
  return connection
  .select('*').from('users')
}