const bip39 = require("bip39");

module.exports = class MnemonicSeed {
  getName() {
    return "mnemonic:seed";
  }

  execute(words) {
    const mnemonic = words.join(" ").trim();
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    console.info(seed);
  }
};
