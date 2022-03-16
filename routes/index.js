const feeSetup = require("./feeSetup");
const feeCompute = require("./feeCompute");

const routes = (app) => {
  app.use("/", feeSetup);
  app.use("/", feeCompute);
};

module.exports = routes;
