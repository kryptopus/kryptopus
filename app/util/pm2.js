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
      pm2.list((error, list) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(list);
      });
    });
  },
  start: options => {
    return new Promise((resolve, reject) => {
      pm2.start(options, (error, proc) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(proc);
      });
    });
  }
};
