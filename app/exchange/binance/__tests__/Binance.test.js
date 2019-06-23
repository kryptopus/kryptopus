jest.mock("https");

const https = require("https");
const Binance = require("../Binance");
const Balance = require("../../Balance");

describe("Binance", () => {
  const mockRequest = content => {
    const data = Buffer.from(JSON.stringify(content));
    https.request.mockImplementation((options, callback) => {
      const response = {
        on: (event, eventCallback) => {
          eventCallback(data);
        }
      };
      callback(response);
      return {
        on: () => {
          return {
            end: () => {}
          };
        }
      };
    });
  };

  describe("getBalances", () => {
    it("should get balances", async () => {
      mockRequest({ balances: [{ asset: "BTC", free: 41, locked: 1 }, { asset: "ETH", free: 24, locked: 13 }] });
      const binance = new Binance("api-key", "api-secret");
      const balances = await binance.getBalances();
      expect(balances).toEqual([new Balance("BTC", 42, 1), new Balance("ETH", 37, 13)]);
    });
  });
});
