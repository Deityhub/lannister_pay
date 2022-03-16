const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle all errors
app.use("/", (err, req, res, next) =>
  res.status(req.status || 500).send({
    Error: err.message,
  })
);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = server;
