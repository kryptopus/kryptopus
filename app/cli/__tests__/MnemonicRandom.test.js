jest.mock("bip39");
jest.spyOn(global.console, "info").mockReturnValue();

const bip39 = require("bip39");
const MnemonicRandom = require("../MnemonicRandom");

describe("MnemonicRandom command", () => {
  it("should call BIP39 generateMnemonic", () => {
    const command = new MnemonicRandom();
    bip39.generateMnemonic.mockReturnValue("12 words");

    command.execute();
    expect(bip39.generateMnemonic).toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledWith("12 words");
  });
});
