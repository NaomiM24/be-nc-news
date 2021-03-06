const express = require('express');
const app = express();
const apiRouter = require("./routers/api-router");
const {psqlErrors, customErrors, serverErrors} = require('./errors/error-handling');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrors)
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app;