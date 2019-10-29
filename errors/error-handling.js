exports.psqlErrors = (err, req, res, next) => {
  console.log(err)
}

exports.customErrors = (err, req, res, next) => {
  console.log(err)
  if (err.status) res.status(err.status).send({msg: err.msg})
}

exports.send405Error = (req, res, next) => {
  res.status(405).send({msg: 'method not allowed'})
}