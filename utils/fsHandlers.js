const fs = require("fs");

/**
 * a promise based utility to read content of a file
 * @param {string} filePath path to file
 * @returns promise
 */
function readFileContent(filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, { encoding: "utf8" }, function (error, data) {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } else {
      const error = new Error(
        "Fee configuration spec not found, please create one"
      );
      error.code = 400;
      reject(error);
    }
  });
}

/**
 * a promise based utility to write content to file
 * @param {string} filePath path to file
 * @param {string} content content to be written in the file
 * @returns promise
 */
function writeToFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, { encoding: "utf-8" }, function (error) {
      if (error) {
        reject(error);
      }
      resolve("Content saved successfully");
    });
  });
}

module.exports = {
  readFileContent,
  writeToFile,
};
