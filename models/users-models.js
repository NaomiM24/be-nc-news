const connection = require("../connection")

exports.fetchUsers = () => {
  return connection
  .select('*').from('users')
}

exports.fetchUserByUsername = (username) => {
  return connection('users').first('*').where({username})
  //.select('*').from('users').where({username})
  
  
}