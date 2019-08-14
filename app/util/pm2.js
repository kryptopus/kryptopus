const pm2 = require("pm2");

module.exports = {
  connect: () => {
    return new Promise((resolve, reject) => {
      pm2.connect(error => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  },
  disconnect: () => {
    pm2.disconnect();
  },
  list: () => {
    return new Promise((resolve, reject) => {
      pm2.list((error, apps) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(apps);
      });
    });
  },
  getAppByName: name => {
    return new Promise((resolve, reject) => {
      pm2.list((error, apps) => {
        if (error) {
          reject(error);
          return;
        }

        const appFound = apps.find(app => app.name === name);
        if (!appFound) {
          reject(new Error(`App not found: ${name}`));
        }
        resolve(appFound);
      });
    });
  },
  start: options => {
    return new Promise((resolve, reject) => {
      pm2.start(options, (error, app) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(app);
      });
    });
  },
  stop: appName => {
    return new Promise((resolve, reject) => {
      pm2.stop(appName, error => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
};
