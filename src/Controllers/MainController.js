const TextCorpusBuilder = require("../NLP/TextCorpusBuilder");
const TargetDirectory = require("../File/TargetDirectory");
const TextClassifierBuilder = require("../NLP/TextClassifierBuilder");
const PdfOcr = require("../File/PdfOcr");
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

    this.ipc.on("done-move-file", (event, args) => {
      this._showSuccess(args);
    });
  }

  _showOpenDialog(event, arg) {
    this.dialog.showOpenDialog(arg).then((result) => {
      event.sender.send("open-dialog-paths-selected", result.filePaths[0]);
    });
  }

  async _analyseFiles(sender, args) {
    let textCorpusBuilder = new TextCorpusBuilder();
    let targetDirectory = new TargetDirectory(args.targetFolder);
    let tmpDirectory = path.join(targetDirectory.path, "tmp");
    let pdfOcr = new PdfOcr("DEU");
    let textClassifierBuilder = new TextClassifierBuilder();

    let textCorpus = await textCorpusBuilder
      .withTargetDirectory(targetDirectory)
      .withTmpDirectory(tmpDirectory)
      .withTextExtractor(pdfOcr)
      .withFileExtension(".pdf")
      .withSender(sender)
      .create();

    let classifier = textClassifierBuilder
      .withLanguage("DEU")
      .withDocuments(textCorpus)
      .withSender(sender)
      .create();

    return classifier.predictPdfs(args.sourceFiles, tmpDirectory);
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

  _showSuccess(args) {}
}

module.exports = MainController;
