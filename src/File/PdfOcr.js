const tesseract = require("node-tesseract-ocr");
const { Poppler } = require("node-poppler");
const config = require("../Configuration/Config");
const path = require("path");
const fs = require("fs");

class PdfOcr {
  constructor(language, popplerPath) {
    this.poppler = new Poppler(popplerPath);
    this.popplerOptions = config.POPPLER_OPTIONS;
    this.tesseractOptions = config.TESSERACT_OPTIONS;
    this.tesseractOptions.lang = language;
  }

  async getText(pdfFile, tmpDir) {
    let imageFileName = path.parse(pdfFile).name;
    let imagePath = path.join(tmpDir, imageFileName);
    this._createDirectory(tmpDir);

    await this._toImage(pdfFile, imagePath);
    let text = await tesseract.recognize(
      imagePath + ".png",
      this.tesseractOptions
    );
    this._deleteFile(imagePath + ".png");

    return text;
  }

  async _toImage(pdfPath, imagePath) {
    await this.poppler.pdfToCairo(pdfPath, imagePath, this.popplerOptions);
  }

  _createDirectory(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  _deleteFile(file) {
    fs.unlinkSync(file);
  }
}

module.exports = PdfOcr;
