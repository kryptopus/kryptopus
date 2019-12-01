const { resolve } = require("path");
const { mkdir, writeFile, readFile } = require("fs").promises;
const Order = require("./Order");

module.exports = class OrderRepository {
  constructor(directoryPath) {
    this.directoryPath = resolve(directoryPath);
  }

  async add(order) {
    // TODO: remove previous saved order if the status is changed

    const exchangeName = order.getExchangeName();
    const id = order.getId();
    const status = order.isOpen() ? "open" : "closed";
    const directoryPath = `${this.directoryPath}/${status}/${exchangeName}`;
    await mkdir(directoryPath, { recursive: true });
    const filePath = `${directoryPath}/${id}.json`;
    const serialized = this.serialize(order);
    await writeFile(filePath, serialized);
  }

  async get(exchangeName, id) {
    try {
      const content = await readFile(`${this.directoryPath}/open/${exchangeName}/${id}.json`);
      const order = this.unserialize(content);
      return order;
    } catch (error) {
      // No open order
    }
    const content = await readFile(`${this.directoryPath}/closed/${exchangeName}/${id}.json`);
    const order = this.unserialize(content);
    return order;
  }

  serialize(order) {
    return JSON.stringify(
      {
        id: order.getId(),
        exchangeName: order.getExchangeName(),
        time: order.getTime(),
        side: order.getSide(),
        type: order.getType(),
        baseSymbol: order.getBaseSymbol(),
        quoteSymbol: order.getQuoteSymbol(),
        price: order.getPrice(),
        baseQuantity: order.getBaseQuantity(),
        receivedBaseQuantity: order.receivedBaseQuantity(),
        status: order.getStatus()
      },
      undefined,
      2
    );
  }

  unserialize(json) {
    const normalized = JSON.parse(json);
    const {
      id,
      time,
      side,
      type,
      exchangeName,
      baseSymbol,
      quoteSymbol,
      price,
      baseQuantity,
      receivedBaseQuantity,
      status
    } = normalized;
    const order = new Order(id, time, side, type, exchangeName, baseSymbol, quoteSymbol, price, baseQuantity);
    switch (status) {
      case Order.STATUS_PARTIALLY_FILLED:
        order.fillPartially(receivedBaseQuantity);
        break;
      case Order.STATUS_FILLED:
        order.fill(receivedBaseQuantity);
        break;
      case Order.STATUS_CANCELED:
        order.cancel();
        break;
      case Order.STATUS_REJECTED:
        order.reject();
        break;
      case Order.STATUS_EXPIRED:
        order.expire();
        break;
      default:
    }

    return order;
  }
};
