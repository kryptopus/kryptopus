module.exports = class WalletBalance {
  getName() {
    return "wallet:balance";
  }

  execute(parameters) {
    const [asset, address] = parameters;

    process.stdout.write(`${asset} (${address}): 0\n`);
  }
}
