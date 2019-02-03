const ec = require("tiny-secp256k1");
const wif = require("wif");
const bip32 = require("bip32");
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const chalk = require("chalk");
const networks = require("@kryptopus/networks");

module.exports = class WalletFromMnemonic {
  getName() {
    return "wallet:fromMnemonic";
  }

  execute([symbol, ...words]) {
    const mnemonic = words.join(" ").trim();
    const seed = bip39.mnemonicToSeed(mnemonic);

    const network = networks[symbol.toLowerCase()];
    if (!network) {
      throw new Error(`Unknown network: ${symbol}`);
    }

    const node = bip32.fromSeed(seed, network);
    const path = `m/44'/${network.bip44}'/0'/0/0`;
    const privateKey = node.derivePath(path);
    const privateWIF = privateKey.toWIF();
    const publicKey = this.getPublicKeyFromPrivateWIF(privateWIF, network);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network
    });

    console.info(chalk.yellow("Path           : ") + path);
    console.info(chalk.yellow("Address        : ") + address);
    console.info(chalk.yellow("Private key WIF: ") + privateWIF);
  }

  getPublicKeyFromPrivateWIF(privateWIF, network) {
    const decoded = wif.decode(privateWIF);
    const { version, privateKey, compressed } = decoded;

    if (version !== network.wif) {
      throw new Error("Invalid network version");
    }

    if (!ec.isPrivate(privateKey)) {
      throw new TypeError("Private key not in range [1, n)");
    }

    return ec.pointFromScalar(privateKey, compressed);
  }
};
