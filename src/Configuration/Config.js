const config = {
  TEMP_DIR_NAME: ".clasificar",
  POPPLER_OPTIONS: {
    firstPageToConvert: 1,
    lastPageToConvert: 1,
    singleFile: true,
    pngFile: true,
  },
  TESSERACT_OPTIONS: {
    oem: 1,
    psm: 3,
  },
};

module.exports = config;
