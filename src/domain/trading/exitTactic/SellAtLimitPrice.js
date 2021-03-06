const assert = require("assert").strict;

module.exports = class SellAtLimitPrice {
  constructor(exchangeName, baseSymbol, quoteSymbol, quoteQuantity, price) {
    assert(
      typeof exchangeName === "string",
      new RangeError("Unable to create SellAtLimitPrice, missing exchange name argument")
    );
    assert(
      typeof baseSymbol === "string",
      new RangeError("Unable to create SellAtLimitPrice, missing base symbol argument")
    );
    assert(
      typeof quoteSymbol === "string",
      new RangeError("Unable to create SellAtLimitPrie, missing quote symbol argument")
    );

    const sanitizedQuantity = Number(quoteQuantity);
    assert(
      typeof sanitizedQuantity === "number" && !Number.isNaN(sanitizedQuantity),
      new RangeError(`Unable to create SellAtLimitPrie, invalid quote quantity: ${quoteQuantity}`)
    );

    const sanitizedPrice = Number(price);
    assert(
      typeof sanitizedPrice === "number" && !Number.isNaN(sanitizedPrice),
      new RangeError(`Unable to create SellAtLimitPrie, invalid price: ${price}`)
    );

    this.exchangeName = exchangeName;
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
    this.quoteQuantity = sanitizedQuantity;
    this.price = sanitizedPrice;
  }

  execute(position, orderService) {
    console.log(position, orderService);
  }
};
