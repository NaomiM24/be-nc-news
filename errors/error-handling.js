exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({msg: err.msg})
  else next(err)
}
exports.psqlErrors = (err, req, res, next) => {
  const psqlRef= {
    "22P02" : {
      status: 400,
      msg: createMessage(err)
    },
    "23503" : {
      status: 404,
      msg: createMessage(err)
    },
    "42703" : {
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

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send("Server Error!")
}

function createMessage(err) {
  return err.message.split(" - ").pop();
}