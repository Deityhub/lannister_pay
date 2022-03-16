const express = require("express");
const router = express.Router();
const Path = require("path");
const computeTransactionFee = require("../utils/computeTransactionFee");
const { readFileContent } = require("../utils/fsHandlers");

router.post("/compute-transaction-fee", async (req, res) => {
  try {
    const payload = req.body;
    const filePath = Path.resolve(process.cwd(), "feeSpec.json");

    const fileContent = await readFileContent(filePath);
    const feeSpec = JSON.parse(fileContent);

    const transactionFee = computeTransactionFee(payload, feeSpec);
    if (!transactionFee) {
      return res.status(400).send({
        Error: "No fee configuration for the transaction.",
      });
    }

    return res.status(200).send(transactionFee);
  } catch (error) {
    return res.status(500).send({
      Error:
        error.message || "Some error occurred while computing transaction fee",
    });
  }
});

module.exports = router;
