const assertKnownInterval = require("../util/assertKnownInterval");

const _id = Symbol("id");
const _currentTimestamp = Symbol("currentTimestamp");
const _interval = Symbol("interval");
const _parameters = Symbol("parameters");
const _executionCount = Symbol("executionCount");
const _firstExecution = Symbol("firstExecution");
const _lastExecution = Symbol("lastExecution");
const _executionTimestamps = Symbol("executionTimestamps");
const _serviceRegistry = Symbol("serviceRegistry");
const _orderIds = Symbol("orderIds");
const notEnumerable = [
  _id,
  _currentTimestamp,
  _interval,
  _parameters,
  _executionCount,
  _firstExecution,
  _lastExecution,
  _executionTimestamps,
  _serviceRegistry,
  _orderIds
];

module.exports = class StrategyEnvironment {
  constructor(id, currentTimestamp, interval, parameters, serviceRegistry) {
    assertKnownInterval(interval);

    this[_id] = id;
    this[_currentTimestamp] = currentTimestamp;
    this[_interval] = interval;
    this[_parameters] = parameters;
    this[_executionCount] = 0;
    this[_firstExecution] = undefined;
    this[_lastExecution] = undefined;
    this[_executionTimestamps] = [];
    this[_orderIds] = [];
    this[_serviceRegistry] = serviceRegistry;

    for (const field of notEnumerable) {
      Object.defineProperty(this, field, {
        enumerable: false
      });
    }

    this.getOpenOrders = this.getOpenOrders.bind(this);
    this.buyAtMarketPrice = this.buyAtMarketPrice.bind(this);
    this.sellAtLimitPrice = this.sellAtLimitPrice.bind(this);
    this.sellAtMarketPrice = this.sellAtMarketPrice.bind(this);
  }

  get id() {
    return this[_id];
  }

  get currentTimestamp() {
    return this[_currentTimestamp];
  }

  get interval() {
    return this[_interval];
  }

  get parameters() {
    return { ...this[_parameters] };
  }

  startExecutionAt(timestamp) {
    if (!this[_firstExecution]) {
      this[_firstExecution] = timestamp;
    }

    this[_executionCount] += 1;
    this[_lastExecution] = timestamp;
    this[_executionTimestamps].push(timestamp);
  }

  endExecutionAt(timestamp) {
    this[_executionTimestamps].push(timestamp);
  }

  get firstExecutionTimestamp() {
    return this[_firstExecution];
  }

  get executionCount() {
    return this[_executionCount];
  }

  get services() {
    return this[_serviceRegistry];
  }

  get orderIds() {
    return this[_orderIds].copyWithin(0);
  }

  set orderIds(ids) {
    this[_orderIds] = ids;
  }

  async getOrders() {
    const orderService = this.services.get("order");
    return orderService.getOrdersFromIds(this.orderIds);
  }

  async getOpenOrders() {
    const orderService = this.services.get("order");
    return orderService.getOpenOrdersFromIds(this.orderIds);
  }

  async buyAtMarketPrice(exchangeName, baseSymbol, quoteSymbol, baseQuantity) {
    const orderService = this.services.get("order");
    const order = await orderService.buyAtMarketPrice(
      this.currentTimestamp,
      exchangeName,
      baseSymbol,
      quoteSymbol,
      baseQuantity
    );

    this[_orderIds].push(order.id);
    return order;
  }

  async sellAtLimitPrice(exchangeName, baseSymbol, quoteSymbol, quoteQuantity, price) {
    const orderService = this.services.get("order");
    const order = await orderService.sellAtLimitPrice(
      this.currentTimestamp,
      exchangeName,
      baseSymbol,
      quoteSymbol,
      quoteQuantity,
      price
    );

    this[_orderIds].push(order.id);

    return order;
  }

  async sellAtMarketPrice(exchangeName, baseSymbol, quoteSymbol, quoteQuantity) {
    const orderService = this.services.get("order");
    const order = await orderService.sellAtMarketPrice(
      this.currentTimestamp,
      exchangeName,
      baseSymbol,
      quoteSymbol,
      quoteQuantity
    );

    this[_orderIds].push(order.id);
    return order;
  }
};
