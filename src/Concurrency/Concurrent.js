const os = require("os");

class Concurrent {
  static ArrayProcessing(func, array) {
    const cpuCount = os.cpus().length;
    let promises = [];

    for (let nTask = 0; nTask < cpuCount; nTask++) {
      promises.push(this._subTask(nTask, cpuCount, array, func));
    }

    return promises;
  }

  static async _subTask(start, increment, array, func) {
    let results = [];

    for (let i = start; i < array.length; i += increment) {
      let result = await func(i, array);
      results.push(result);
    }

    return results;
  }
}

module.exports = Concurrent;
