const natural = require("natural");
const path = require("path");
const PdfOcr = require("../File/PdfOcr");

class TextClassifier {
  constructor(language, textExtractor) {
    this.textExtractor = textExtractor;
    this.classifier = new natural.BayesClassifier();
    this.language = language;
  }

  addDocument(text, label) {
    this.classifier.addDocument(text, label);
  }

  fit() {
    this.classifier.train();
  }

  predict(text) {
    return this.classifier.getClassifications(text);
  }

  async predictPdf(pdfPath, tmpDir) {
    let text = await this.textExtractor.getText(pdfPath, tmpDir);
    return this.predict(text);
  }

  async predictPdfs(pdfList, tmpDir) {
    let predictions = [];
    for (const pdfPath of pdfList) {
      let prediction = await this.predictPdf(pdfPath, tmpDir);
      predictions.push({
        path: pdfPath,
        name: path.basename(pdfPath),
        predictions: prediction,
      });
    }
    return predictions;
  }
}

module.exports = TextClassifier;