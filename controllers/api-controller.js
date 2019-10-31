const {fetchAvailableEndpoints} = require('../models/api-model')


exports.getAvailableEndpoints = (req, res, next) => {
  console.log('in controller')
  fetchAvailableEndpoints((err, endpoints)=> {
    if (err) console.log(err)
    res.status(200).json({endpoints})
  })
}