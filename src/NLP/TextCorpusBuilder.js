const TextCorpus = require("../NLP/TextCorpus");
const concurrent = require("../Concurrency/Concurrent");
const settings = require("../Configuration/Config");
const path = require("path");

class TextCorpusBuilder {
  constructor() {
    this.textCorpus = null;
    this.targetDirectory = null;
    this.textExtractor = null;
    this.fileExtension = null;
    this.sender = null;
    this.hashAlgo = null;
    this.doneCount = 1;
  }

  withTargetDirectory(targetDirectory) {
    this.targetDirectory = targetDirectory;
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

  withHashAlgo(hashAlgo) {
    this.hashAlgo = hashAlgo;
    return this;
  }

  async create() {
    if (!this._isValid()) {
      throw new Error("TextCorpusBuilder is missing values");
    }

    let files = this.targetDirectory.getAllFiles(this.fileExtension);

    this.textCorpus = new TextCorpus(
      path.join(this.targetDirectory.appPath, settings.TEXT_CORPUS_FILE_NAME)
    );
    this.textCorpus.restore();
    await this._runTextExtraction(files);
    this.textCorpus.save();

    this.sender.send("done-scan-progress");
    return this.textCorpus;
  }

  async _runTextExtraction(files) {
    let promises = concurrent.ArrayProcessing(
      this._processDocument.bind(this),
      files
    );
    await Promise.all(promises);
  }

  async _processDocument(i, files) {
    this._sendUpdate(files);

    let filePath = files[i];
    let category = path.basename(path.dirname(filePath));
    let text = "";
    let md5 = this.hashAlgo.getFileHash(filePath);

    if (this.textCorpus.has(md5)) {
      text = this.textCorpus.get(md5).text;
    } else {
      text = await this.textExtractor.getText(
        filePath,
        this.targetDirectory.appPath
      );
    }

    this.textCorpus.add(filePath, category, text, md5);
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
      !this.textExtractor ||
      !this.fileExtension ||
      !this.sender ||
      !this.hashAlgo
    );
  }
}

module.exports = TextCorpusBuilder;
