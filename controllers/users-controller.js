const { fetchUsers, fetchUserByUsername } = require('../models/users-models')

exports.getUsers = (req, res, next) => {
  fetchUsers().then(users => {
    res.status(200).send({users})
  })
}

exports.getUserByUsername = (req, res, next) => {
  const {username} = req.params
  fetchUserByUsername(username).then(user => {
    if (user) res.status(200).send({user})
    // else 
  }).catch(next);
}