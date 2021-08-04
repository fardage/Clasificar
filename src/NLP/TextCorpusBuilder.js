const path = require("path");
const concurrent = require("../Concurrency/Concurrent");

class TextCorpusBuilder {
  constructor() {
    this.targetDirectory = null;
    this.tmpDirectory = null;
    this.textExtractor = null;
    this.fileExtension = null;
    this.sender = null;
    this.doneCount = 1;
  }

  withTargetDirectory(targetDirectory) {
    this.targetDirectory = targetDirectory;
    return this;
  }

  withTmpDirectory(tmpDirectory) {
    this.tmpDirectory = tmpDirectory;
    return this;
  }

  withTextExtractor(textExtractor) {
    this.textExtractor = textExtractor;
    return this;
  }

  withFileExtension(fileExtension) {
    this.fileExtension = fileExtension;
    return this;
  }

  withUpdateNotify(updateNotify) {
    this.updateNotify = updateNotify;
    return this;
  }

  withSender(sender) {
    this.sender = sender;
    return this;
  }

  async create() {
    if (!this._isValid()) {
      throw new Error("TextCorpusBuilder is missing values");
    }

    let files = this.targetDirectory.getAllFiles(this.fileExtension);
    let textCorpus = await this._runTextExtraction(files);
    this.sender.send("done-scan-progress");

    return textCorpus;
  }

  async _runTextExtraction(files) {
    let promises = concurrent.ArrayProcessing(this._getText.bind(this), files);
    let results = await Promise.all(promises);
    return [].concat.apply([], results);
  }

  async _getText(i, files) {
    this._sendUpdate(files);
    let category = path.basename(path.dirname(files[i]));
    let text = await this.textExtractor.getText(files[i], this.tmpDirectory);
    return [category, text];
  }

  _sendUpdate(files) {
    this.sender.send("update-scan-progress", {
      files: files,
      doneCount: this.doneCount++,
    });
  }

  _isValid() {
    return !(
      !this.targetDirectory ||
      !this.tmpDirectory ||
      !this.textExtractor ||
      !this.fileExtension ||
      !this.sender
    );
  }
}

module.exports = TextCorpusBuilder;
