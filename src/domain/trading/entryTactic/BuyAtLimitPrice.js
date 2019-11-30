const assert = require("assert").strict;

module.exports = class BuyAtLimitPrice {
  constructor(exchangeName, baseSymbol, quoteSymbol, baseQuantity, price) {
    assert(
      typeof exchangeName === "string",
      new RangeError("Unable to create BuyAtLimitPrice, missing exchange name argument")
    );
    assert(
      typeof baseSymbol === "string",
      new RangeError("Unable to create BuyAtLimitPrice, missing base symbol argument")
    );
    assert(
      typeof quoteSymbol === "string",
      new RangeError("Unable to create BuyAtLimitPrie, missing quote symbol argument")
    );

    const sanitizedQuantity = Number(baseQuantity);
    assert(
      typeof sanitizedQuantity === "number" && !Number.isNaN(sanitizedQuantity),
      new RangeError(`Unable to create BuyAtLimitPrie, invalid quote quantity: ${baseQuantity}`)
    );

    const sanitizedPrice = Number(price);
    assert(
      typeof sanitizedPrice === "number" && !Number.isNaN(sanitizedPrice),
      new RangeError(`Unable to create BuyAtLimitPrie, invalid price: ${price}`)
    );

    this.exchangeName = exchangeName;
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
    this.baseQuantity = sanitizedQuantity;
    this.price = sanitizedPrice;
  }

  execute(position, orderService) {
    console.log(position, orderService);
  }
};
