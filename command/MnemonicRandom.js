const bip39 = require("bip39");

module.exports = class MnemonicRandom {
  getName() {
    return "mnemonic:random";
  }

  execute() {
    const mnemonic = bip39.generateMnemonic();
    console.info(mnemonic);
  }
};
