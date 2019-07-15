const https = require("https");

module.exports = function requestRemoteJson(options) {
  return new Promise((resolve, reject) => {
    https
      .request(options, response => {
        let data = "";
        response.on("data", chunk => {
          data += chunk;
        });
        response.on("end", () => {
          resolve(JSON.parse(data.toString()));
        });
      })
      .on("error", error => {
        reject(error);
      })
      .end();
  });
};
