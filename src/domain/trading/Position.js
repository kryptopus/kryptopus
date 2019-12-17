const assert = require("assert").strict;
const Order = require("../exchange/Order");

module.exports = class Position {
  /**
   * @param {string} id
   * @param {string} entryTacticName
   * @param {string[]} entryTacticParameters
   * @param {string} exitTacticName
   * @param {string[]} exitTacticParameters
   */
  constructor(id, entryTacticName, entryTacticParameters, exitTacticName, exitTacticParameters) {
    this.id = id;
    this.entryTacticName = entryTacticName;
    this.entryTacticParameters = entryTacticParameters;
    this.exitTacticName = exitTacticName;
    this.exitTacticParameters = exitTacticParameters;
    this.entered = false;
    this.exited = false;

    this.entryOrders = [];
    this.exitOrders = [];
  }

  getId() {
    return this.id;
  }

  getEntryTacticName() {
    return this.entryTacticName;
  }

  getEntryTacticParameters() {
    return this.entryTacticParameters;
  }

  getExitTacticName() {
    return this.exitTacticName;
  }

  getExitTacticParameters() {
    return this.exitTacticParameters;
  }

  isEntered() {
    return this.entered;
  }

  isExited() {
    return this.exited;
  }

  addEntryOrder(order) {
    assert(order instanceof Order, "Unable to add order to trading position, it is not an instance of Order");

    this.entryOrders.push(order);
  }

  addExitOrder(order) {
    assert(order instanceof Order, "Unable to add order to trading position, it is not an instance of Order");

    this.exitOrders.push(order);
  }

  getEntryOrders() {
    return this.entryOrders.copyWithin(0);
  }

  getExitOrders() {
    return this.exitOrders.copyWithin(0);
  }

  getOpenOrders() {
    const openEntryOrders = this.entryOrders.filter(this.isOrderOpenPredicat);
    const openExitOrders = this.exitOrders.filter(this.isOrderOpenPredicat);
    return [...openEntryOrders, ...openExitOrders];
  }

  getClosedOrders() {
    const closedEntryOrders = this.entryOrders.filter(this.isOrderClosedPredicat);
    const closedExitOrders = this.exitOrders.filter(this.isOrderClosedPredicat);
    return [...closedEntryOrders, ...closedExitOrders];
  }

  isOrderOpenPredicat(order) {
    return order.isOpen();
  }

  isOrderClosedPredicat(order) {
    return order.isClosed();
  }
};
