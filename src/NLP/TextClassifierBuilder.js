const TextClassifier = require("../NLP/TextClassifier");

class TextClassifierBuilder {
  constructor() {
    this.language = null;
    this.textCorpus = null;
    this.sender = null;
    this.textExtractor = null;
  }

  withLanguage(language) {
    this.language = language;
    return this;
  }

  withTextCorpus(textCorpus) {
    this.textCorpus = textCorpus;
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
    classifier.addTextCorpus(this.textCorpus);
    classifier.fit();

    this.sender.send("done-train-model-progress");

    return classifier;
  }

  _isValid() {
    return !(
      !this.language ||
      !this.textCorpus ||
      !this.sender ||
      !this.textExtractor
    );
  }
}

module.exports = TextClassifierBuilder;
