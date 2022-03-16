const express = require("express");
const router = express.Router();
const Path = require("path");
const computeTransactionFee = require("../utils/computeTransactionFee");
const { readFileContent } = require("../utils/fsHandlers");

const transactionFeeStore = new Map();

router.post("/compute-transaction-fee", async (req, res) => {
  try {
    const payload = req.body;

    if (transactionFeeStore.has(payload.ID)) {
      // grab already calculated value from store
      const transactionFee = transactionFeeStore.get(payload.ID);
      return res.status(200).send(transactionFee);
    }

    const filePath = Path.resolve(process.cwd(), "feeSpec.json");

    const fileContent = await readFileContent(filePath);
    const feeSpec = JSON.parse(fileContent);

    const transactionFee = computeTransactionFee(payload, feeSpec);
    if (!transactionFee) {
      const error = new Error("No fee configuration for the transaction.");
      error.code = 400;
      throw error;
    }

    transactionFeeStore.set(payload.ID, transactionFee);

    return res.status(200).send(transactionFee);
  } catch (error) {
    return res.status(error.code || 500).send({
      Error:
        error.message || "Some error occurred while computing transaction fee",
    });
  }
});

module.exports = router;
