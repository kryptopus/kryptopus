jest.mock("https");

const https = require("https");
const Binance = require("../Binance");

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
      mockRequest({ balances: { foo: "bar" } });
      const binance = new Binance("api-key", "api-secret");
      const balances = await binance.getBalances();
      expect(balances).toEqual({ foo: "bar" });
    });
  });
});
