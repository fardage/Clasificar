const path = require("path");

class TextCorpusBuilder {
  constructor() {
    this.targetDirectory = null;
    this.tmpDirectory = null;
    this.textExtractor = null;
    this.fileExtension = null;
    this.sender = null;
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

    let textCorpus = [];

    let files = this.targetDirectory.getAllFiles(this.fileExtension);
    for (let i = 0; i < files.length; i++) {
      this.sender.send("update-scan-progress", {
        files: files,
        doneCount: i + 1,
      });
      let category = path.basename(path.dirname(files[i]));
      let text = await this.textExtractor.getText(files[i], this.tmpDirectory);
      textCorpus.push([category, text]);
    }
    this.sender.send("done-scan-progress");

    return textCorpus;
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
