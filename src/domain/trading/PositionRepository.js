const { resolve } = require("path");
const { writeFile, readFile, opendir } = require("fs").promises;
const Position = require("./Position");
const OrderRepository = require("../exchange/OrderRepository");

module.exports = class PositionRepository {
  /**
   * @param {string} directoryPath
   * @param {OrderRepository} orderRepository
   */
  constructor(directoryPath, orderRepository) {
    this.directoryPath = resolve(directoryPath);
    this.orderRepository = orderRepository;
  }

  /**
   * @param {Position} position
   */
  async add(position) {
    const serialized = this.serialize(position);
    const filePath = `${this.directoryPath}/open/${position.getId()}.json`;
    await writeFile(filePath, serialized);
  }

  async getOpenPositions() {
    const directory = await opendir(`${this.directoryPath}/open`);
    const jsonPattern = /\.json$/;

    const positions = [];
    for await (const item of directory) {
      if (item.name.search(jsonPattern) > 0) {
        const content = await readFile(`${this.directoryPath}/open/${item.name}`);
        const position = await this.unserialize(content);
        positions.push(position);
      }
    }
    return positions;
  }

  /**
   * @param {Position} position
   */
  serialize(position) {
    const entryOrders = position.getEntryOrders();
    const exitOrders = position.getExitOrders();
    return JSON.stringify(
      {
        id: position.getId(),
        entryTactic: {
          name: position.getEntryTacticName(),
          parameters: position.getEntryTacticParameters()
        },
        exitTactic: {
          name: position.getExitTacticName(),
          parameters: position.getExitTacticParameters()
        },
        entryOrders: entryOrders.map(order => {
          return {
            exchangeName: order.getExchangeName(),
            id: order.getId()
          };
        }),
        exitOrders: exitOrders.map(order => {
          return {
            exchangeName: order.getExchangeName(),
            id: order.getId()
          };
        })
      },
      undefined,
      2
    );
  }

  async unserialize(json) {
    const normalized = JSON.parse(json);
    const {
      id,
      entryOrders,
      exitOrders,
      entryTactic: { name: entryTacticName, parameters: entryTacticParameters },
      exitTactic: { name: exitTacticName, parameters: exitTacticParameters }
    } = normalized;
    const position = new Position(id, entryTacticName, entryTacticParameters, exitTacticName, exitTacticParameters);

    for (const { exchangeName, id: orderId } of entryOrders) {
      const order = await this.orderRepository.get(exchangeName, orderId);
      position.addEntryOrder(order);
    }
    for (const { exchangeName, id: orderId } of exitOrders) {
      const order = await this.orderRepository.get(exchangeName, orderId);
      position.addExitOrder(order);
    }

    return position;
  }
};
