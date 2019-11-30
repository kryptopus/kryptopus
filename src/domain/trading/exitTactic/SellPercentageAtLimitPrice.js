const assert = require("assert").strict;

module.exports = class SellPercentageAtLimitPrice {
  constructor(exchangeName, baseSymbol, quoteSymbol, percentage, price) {
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

    const sanitizedPercentage = this.sanitizePercentage(percentage);
    const sanitizedPrice = Number(price);
    assert(
      typeof sanitizedPrice === "number" && !Number.isNaN(sanitizedPrice),
      new RangeError(`Unable to create SellAtLimitPrie, invalid price: ${price}`)
    );

    this.exchangeName = exchangeName;
    this.baseSymbol = baseSymbol;
    this.quoteSymbol = quoteSymbol;
    this.percentage = sanitizedPercentage;
    this.price = sanitizedPrice;
  }

  execute(position, orderService) {
    console.log(position, orderService);
  }

  sanitizePercentage(percentage) {
    let sanitizedPercentage = Number(percentage);
    assert(
      typeof sanitizedPercentage === "number" && !Number.isNaN(sanitizedPercentage),
      new RangeError(`Unable to create SellAtLimitPrie, invalid percentage: ${percentage}`)
    );

    if (sanitizedPercentage < 0) {
      sanitizedPercentage = 0;
    }

    if (sanitizedPercentage > 100) {
      sanitizedPercentage = 100;
    }

    return sanitizedPercentage;
  }
};
