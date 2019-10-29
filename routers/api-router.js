const apiRouter = require(express).Router();

apiRouter.use("/", () => {
  console.log('in apiRouter')
})

module.exports = apiRouter;