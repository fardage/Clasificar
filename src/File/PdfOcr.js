const tesseract = require("node-tesseract-ocr");
const { Poppler } = require("node-poppler");
const path = require("path");
const fs = require("fs");

class PdfOcr {
  constructor(language) {
    this.language = language;

    this.poppler = new Poppler("/opt/homebrew/Cellar/poppler/21.07.0_1/bin/");
    this.popplerOptions = {
      firstPageToConvert: 1,
      lastPageToConvert: 1,
      singleFile: true,
      pngFile: true,
    };

    this.tesseractOptions = {
      lang: this.language,
      oem: 1,
      psm: 3,
    };
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
}

module.exports = PdfOcr;
