const settings = require("../Configuration/Config");
const fs = require("fs");
const path = require("path");

class TargetDirectory {
  constructor(dirPath) {
    this.dirPath = dirPath;
    this.appPath = path.join(dirPath, settings.APP_DIR_NAME);
  }

  getAllFiles(fileExtension) {
    let files = this._readAllFiles(this.dirPath);

    if (!fileExtension) {
      return files;
    }

    return files.filter((pdfPath) => path.extname(pdfPath) === fileExtension);
  }

  _readAllFiles(dirPath, arrayOfFiles) {
    const self = this;
    arrayOfFiles = arrayOfFiles || [];

    let files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      let fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = self._readAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }
}

module.exports = TargetDirectory;
