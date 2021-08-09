const TextCorpusBuilder = require("../NLP/TextCorpusBuilder");
const TargetDirectory = require("../File/TargetDirectory");
const TextClassifierBuilder = require("../NLP/TextClassifierBuilder");
const PdfOcr = require("../File/PdfOcr");
const Hash = require("../Crypto/Hash");
const path = require("path");
const fs = require("fs");

class MainController {
  constructor(ipc, dialog) {
    this.ipc = ipc;
    this.dialog = dialog;
    this.classifier = null;
  }

  init() {
    this.ipc.on("show-open-dialog", (event, arg) => {
      this._showOpenDialog(event, arg);
    });

    this.ipc.on("start-sort", (event, args) => {
      this._analyseFiles(event.sender, args).then((r) => {
        event.sender.send("done-classification-progress", r);
      });
    });

    this.ipc.on("move-file", (event, args) => {
      this._copyFile(event.sender, args);
    });
  }

  _showOpenDialog(event, arg) {
    this.dialog.showOpenDialog(arg).then((result) => {
      event.sender.send("open-dialog-paths-selected", result.filePaths[0]);
    });
  }

  async _analyseFiles(sender, arg) {
    let settings = JSON.parse(arg);
    let textCorpusBuilder = new TextCorpusBuilder();
    let targetDirectory = new TargetDirectory(settings.targetFolder);
    let pdfOcr = new PdfOcr(settings.docLanguage, settings.popplerPath);
    let textClassifierBuilder = new TextClassifierBuilder();
    let md5Hash = new Hash();

    let textCorpus = await textCorpusBuilder
      .withTargetDirectory(targetDirectory)
      .withTextExtractor(pdfOcr)
      .withFileExtension(".pdf")
      .withSender(sender)
      .withHashAlgo(md5Hash)
      .create();

    let classifier = textClassifierBuilder
      .withLanguage(settings.docLanguage)
      .withTextCorpus(textCorpus)
      .withSender(sender)
      .withTextExtractor(pdfOcr)
      .create();

    return classifier.predictPdfs(
      settings.sourceFiles,
      targetDirectory.appPath
    );
  }

  _copyFile(sender, arg) {
    fs.rename(
      arg.from,
      path.join(arg.targetFolder, arg.to, path.basename(arg.from)),
      (err) => {
        sender.send("done-move-file", err);
      }
    );
  }
}

module.exports = MainController;
