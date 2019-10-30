exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({msg: err.msg})
  else next(err)
}
exports.psqlErrors = (err, req, res, next) => {
  console.log(err.message)
  const psqlRef= {
    "22P02" : {
      status: 400,
      msg: createMessage(err)
    }
  }
  const thisErr = psqlRef[err.code]
  if (thisErr) res.status(thisErr.status).send({msg: thisErr.msg});
  else next(err);
}


exports.send405Error = (req, res, next) => {
  res.status(405).send({msg: 'method not allowed'})
}

function createMessage(err) {
  return err.message.split(" - ").pop();
}