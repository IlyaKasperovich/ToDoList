class AbstractLogger {
  constructor(config) {
    this._logLevel = config.level;
  }

  log(message) {
    throw new Error("Not implemented");
  }
}

export class Logger extends AbstractLogger {
  constructor(config) {
    super(config);
  }

  log(message) {
    switch (this._logLevel) {
      case "debug":
        console.log(message);
        break;

      case "production":
        break;
    }
  }
}

export class LoggerWithHistory extends AbstractLogger {
  constructor(config) {
    super(config);
    this._id = 0;
    this._headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, PATCH"
    };
  }

  async getLogs() {
    let response = await fetch("http://localhost:3000/logs");
    return await response.json();
  }

  checkId(id) {
    if (id === 99) {
      this._id = 0;
    } else {
      this._id = id;
    }
  }

  async log(message, headers = this._headers, logId = this._id) {
    switch (this._logLevel) {
      case "debug": {
        let logObj = {
          id: logId,
          event: message,
          time: new Date()
        };
        let response = await fetch("http://localhost:3000/logs", {
          headers,
          method: "POST",
          body: JSON.stringify(logObj)
        });
        if (this._id === 99) this._id = 0;
        else this._id++;
      }

      case "production":
        break;
    }
  }
}
