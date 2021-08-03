export default class Settings {
  constructor() {
    this.targetFolder = null;
    this.sourceFiles = [];
    this.docLanguage = localStorage.getItem("docLanguage");
    this.popplerPath = localStorage.getItem("popplerPath");
  }

  setDocLanguage(docLanguage) {
    localStorage.setItem("docLanguage", docLanguage);
    this.docLanguage = docLanguage;
  }

  setPopplerPath(popplerPath) {
    localStorage.setItem("popplerPath", popplerPath);
    this.popplerPath = popplerPath;
  }

  setSourceFiles(fileList) {
    let filtered = [...fileList].filter((f) => f.path.endsWith(".pdf"));
    this.sourceFiles = filtered.map((f) => f.path);
  }
}
