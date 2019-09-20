const { v4: generateUuid } = require("uuid");
const Position = require("../../Position");

module.exports = class PositionService {
  constructor(repository, orderService) {
    this.repository = repository;
    this.orderService = orderService;
  }

  async enter(entryTactic, exitTactic) {
    const id = generateUuid();
    const position = new Position(id, entryTactic, exitTactic);

    await this.checkPosition(position);

    return position;
  }

  async checkPosition(position) {
    if (!position.isEntered()) {
      await position.executeEntryTactic(this.orderService);
    }

    if (!position.isExited()) {
      await position.executeExitTactic(this.orderService);
    }
  }

  async exit(position) {
    const openOrders = position.getOpenOrders();
    for (const openOrder of openOrders) {
      // orderService.close(openOrder);
      console.log(openOrder);
    }

    // SELL or BUY at market
  }

  async getPositions(environmentId) {
    console.log(environmentId);
    return this.repository.getOpenPositions();
  }
};
