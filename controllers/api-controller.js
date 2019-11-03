const {fetchAvailableEndpoints} = require('../models/api-model')


exports.getAvailableEndpoints = (req, res, next) => {
  fetchAvailableEndpoints((err, endpoints)=> {
    res.status(200).json({endpoints})
  })
}