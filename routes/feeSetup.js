const express = require("express");
const router = express.Router();
const Path = require("path");
const parseSpec = require("../utils/parseSpec");
const { writeToFile } = require("../utils/fsHandlers");

router.post("/fees", async (req, res) => {
  try {
    const { FeeConfigurationSpec } = req.body;

    if (!FeeConfigurationSpec) {
      const error = new Error("Please provide fee configuration spec");
      error.code = 400;
      throw error;
    }

    const parsedSpec = parseSpec(FeeConfigurationSpec);

    // store spec in a file in the server
    const filePath = Path.resolve(process.cwd(), "feeSpec.json");
    await writeToFile(filePath, JSON.stringify(parsedSpec));

    return res.status(201).send({
      status: "ok",
    });
  } catch (error) {
    return res.status(error.code || 500).send({
      Error: error.message || "Some error occurred while parsing the spec",
    });
  }
});

module.exports = router;
