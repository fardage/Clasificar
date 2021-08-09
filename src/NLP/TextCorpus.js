const Document = require("../File/Document");
const fs = require("fs");

class TextCorpus {
  constructor(cachePath, documents) {
    this.cachePath = cachePath;
    this.documents = documents ? documents : new Map();
  }

  save() {
    let stringMap = JSON.stringify(Array.from(this.documents.entries()));
    fs.writeFileSync(this.cachePath, stringMap);
    return this;
  }

  restore() {
    if (fs.existsSync(this.cachePath)) {
      let fileContent = fs.readFileSync(this.cachePath);
      this.documents = new Map(JSON.parse(fileContent));
      return this.documents;
    }
    return new Map();
  }

  has(md5) {
    return this.documents.has(md5);
  }

  get(md5) {
    return this.documents.get(md5);
  }

  add(filePath, category, text, md5) {
    this.documents.set(md5, new Document(filePath, category, text, md5));
  }
}

module.exports = TextCorpus;
