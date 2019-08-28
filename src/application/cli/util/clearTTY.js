const readline = require("readline");

module.exports = function clearTTY() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};
