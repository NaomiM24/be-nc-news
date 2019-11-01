const {fetchAvailableEndpoints} = require('../models/api-model')


exports.getAvailableEndpoints = (req, res, next) => {
  fetchAvailableEndpoints((err, endpoints)=> {
    if (err) console.log(err)
    res.status(200).json({endpoints})
  })
}