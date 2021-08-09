const crypto = require("crypto");
const fs = require("fs");

class Hash {
  getFileHash(filePath) {
    let file_buffer = fs.readFileSync(filePath);
    let sum = crypto.createHash("md5");
    sum.update(file_buffer);
    const hex = sum.digest("hex");
    return hex;
  }
}

module.exports = Hash;
