const Entry = require("../Entry");

describe("Entry", () => {
  describe("addOrder()", () => {
    it("should throw an error if the argument is not an instance of Order", () => {
      const entry = new Entry("id");
      expect(() => {
        entry.addOrder({});
      }).toThrow();
    });
  });
});
