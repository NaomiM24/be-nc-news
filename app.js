const express = require('express');
const app = express();
const apiRouter = require("./routers/api-router");
const {psqlErrors, customErrors} = require('./errors/error-handling')

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrors)
app.use(psqlErrors)

module.exports = app;