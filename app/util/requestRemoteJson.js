const https = require("https");

module.exports = function requestRemoteJson(options) {
  return new Promise((resolve, reject) => {
    https
      .request(options, response => {
        const chunks = [];
        response.on("data", chunk => {
          chunks.push(chunk);
        });
        response.on("end", () => {
          const data = chunks.join();
          resolve(JSON.parse(data.toString()));
        });
      })
      .on("error", error => {
        reject(error);
      })
      .end();
  });
};
