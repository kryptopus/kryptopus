const bip39 = require("bip39");

module.exports = class MnemonicValidate {
  getName() {
    return "mnemonic:validate";
  }

  execute(words) {
    const mnemonic = words.join(" ").trim();
    const result = bip39.validateMnemonic(mnemonic);
    console.info(result);
  }
};
