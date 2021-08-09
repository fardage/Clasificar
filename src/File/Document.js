class Document {
  constructor(filePath, category, text, hash) {
    this.filePath = filePath;
    this.category = category;
    this.text = text;
    this.hash = hash;
  }
}

module.exports = Document;
