const connection = require("../connection")

exports.fetchUsers = () => {
  return connection
  .select('*').from('users')
}

exports.fetchUserByUsername = (username) => {
  return connection('users').first('*').where({username})
  .then(user => {
    if (!user)
      return Promise.reject({
      status: 404,
      msg: "username does not exist"
    })
    return user
  })
  
  
}