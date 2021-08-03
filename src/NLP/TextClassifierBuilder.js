const TextClassifier = require("../NLP/TextClassifier");

class TextClassifierBuilder {
  constructor() {
    this.language = null;
    this.documents = null;
    this.sender = null;
    this.textExtractor = null;
  }

  withLanguage(language) {
    this.language = language;
    return this;
  }

  withDocuments(documents) {
    this.documents = documents;
    return this;
  }

  withSender(sender) {
    this.sender = sender;
    return this;
  }

  withTextExtractor(textExtractor) {
    this.textExtractor = textExtractor;
    return this;
  }

  create() {
    if (!this._isValid()) {
      throw new Error("TextClassifierBuilder is missing values");
    }

    let classifier = new TextClassifier(this.language, this.textExtractor);
    for (const document of this.documents) {
      classifier.addDocument(document[1], document[0]);
    }
    classifier.fit();
    this.sender.send("done-train-model-progress");
    return classifier;
  }

  _isValid() {
    return !(!this.language || !this.documents || !this.sender);
  }
}

module.exports = TextClassifierBuilder;
