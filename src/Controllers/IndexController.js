import Settings from "../Configuration/Settings";

export default class IndexController {
  constructor(ipc) {
    this.ipc = ipc;
    this.settings = new Settings();
  }

  init() {
    $("#btnTarget").on("click", () => {
      event.preventDefault();
      event.stopPropagation();
      this._showOpenFileDialog();
    });
    $("#btnStartSort").on("click", () => {
      event.preventDefault();
      event.stopPropagation();
      this._startBtnClicked();
    });
    $("#settingsBtn").on("click", () => {
      event.preventDefault();
      event.stopPropagation();
      this._toggleSettingsVisibility();
    });
    $("#txtPopplerPath")
      .on("change", (event) => this.settings.setPopplerPath(event.target.value))
      .val(this.settings.popplerPath);
    $("#txtDocLanguage")
      .on("change", (event) => this.settings.setDocLanguage(event.target.value))
      .val(this.settings.docLanguage);
    this.ipc.on("open-dialog-paths-selected", (event, arg) => {
      this._setTextTarget(arg);
    });
    this.ipc.on("update-scan-progress", (event, arg) => {
      this._updateScanProgress(arg);
    });
    this.ipc.on("done-scan-progress", (event) => {
      this._handleScanProgressDone();
    });
    this.ipc.on("done-train-model-progress", (event) => {
      this._handleTrainDone();
    });
    this.ipc.on("done-classification-progress", (event, arg) => {
      this._handleClassificationDone(arg);
    });
    $("#drop-area")
      .on("dragover", (event) => {
        event.preventDefault();
        event.stopPropagation();
      })
      .on("dragleave", (event) => {
        event.preventDefault();
        event.stopPropagation();
      })
      .on("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._setSourceDocuments(event.originalEvent.dataTransfer.files);
      });
  }

  _showOpenFileDialog() {
    const dialogOptions = {
      title: "Select a folder",
      properties: ["openDirectory"],
    };

    this.ipc.send("show-open-dialog", dialogOptions);
  }

  _startBtnClicked() {
    if (!this.settings.targetFolder) {
      $("#txtTarget").attr("aria-invalid", "true");
    } else if (!this.settings.sourceFiles.length === 0) {
      $("#drop-area").attr("aria-invalid", "true");
    } else if (!this.settings.docLanguage) {
      $("#settings").attr("hidden", false);
      $("#txtDocLanguage").attr("aria-invalid", "true");
    } else if (!this.settings.popplerPath) {
      $("#settings").attr("hidden", false);
      $("#txtPopplerPath").attr("aria-invalid", "true");
    } else {
      $("#txtTarget").attr("aria-invalid", "false");
      $("#drop-area").attr("aria-invalid", "false");
      $("#txtDocLanguage").attr("aria-invalid", "false");
      $("#txtPopplerPath").attr("aria-invalid", "false");
      this._startSort();
    }
  }

  _setTextTarget(text) {
    this.settings.targetFolder = text;
    $("#txtTarget").val(text);
  }

  _updateScanProgress(state) {
    let current = state.doneCount;
    let max = state.files.length;
    $("#progressBarScan").attr("value", current).attr("max", max);
    this._setStatusText("Scanning Document: " + state.files[current - 1]);
  }

  _handleScanProgressDone() {
    $("#scanTaskChkBox").attr("checked", true).attr("disabled", false);
    this._setStatusText("Building NLP Model");
  }

  _handleTrainDone() {
    $("#nlpTaskChkBox").attr("checked", true).attr("disabled", false);
    this._setStatusText("Classifying new Documents");
  }

  _handleClassificationDone(predictions) {
    $("#predictTaskChkBox").attr("checked", true).attr("disabled", false);
    this._setStatusText("Done!");
    this._showSourceDocuments(predictions);
    this._resetStatus();
  }

  _setStatusText(text) {
    $("#statusText").text(text);
  }

  _showSourceDocuments(files) {
    $("#categories").empty();

    for (const file of files) {
      let details = $(
        "<details open><summary>" + file.name + "</summary></details>"
      );

      if (!file.predictions) {
        details.append("<li><small>Classification pending</small></li>");
      } else {
        let predictions = file.predictions;
        for (let i = 0; i < predictions.length && i < 4; i++) {
          let suggestion = $(
            "<button class='outline'>" + predictions[i].label + "</button>"
          )
            .on("click", (event) => this._handleSortFileCommand(event))
            .data("data", {
              from: file.path,
              targetFolder: this.settings.targetFolder,
              to: predictions[i].label,
            });
          details.append(suggestion);
        }
      }
      $("#categories").append(details);
    }
  }

  _setSourceDocuments(fileList) {
    this.settings.setSourceFiles(fileList);
    this._showSourceDocuments(fileList);
  }

  _startSort() {
    $("#btnStartSort")
      .addClass("secondary")
      .attr("disabled", true)
      .attr("readonly", true)
      .attr("aria-busy", "true");

    this.ipc.send("start-sort", JSON.stringify(this.settings));
  }

  _resetStatus() {
    $("#btnStartSort")
      .addClass("secondary")
      .attr("disabled", false)
      .attr("readonly", false)
      .attr("aria-busy", "false");
    $("#scanTaskChkBox").attr("checked", false).attr("disabled", true);
    $("#nlpTaskChkBox").attr("checked", false).attr("disabled", true);
    $("#predictTaskChkBox").attr("checked", false).attr("disabled", true);
    this._setStatusText("Idle...");
  }

  _handleSortFileCommand(event) {
    event.preventDefault();
    event.stopPropagation();
    let element = $(event.target);
    this.ipc.send("move-file", element.data("data"));

    element.parent().remove();
  }

  _toggleSettingsVisibility() {
    let isHidden = $("#settings").attr("hidden");
    $("#settings").attr("hidden", !isHidden);
  }
}
