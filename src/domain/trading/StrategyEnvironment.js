const assertKnownInterval = require("../util/assertKnownInterval");

const _id = Symbol("id");
const _currentTimestamp = Symbol("currentTimestamp");
const _interval = Symbol("interval");
const _parameters = Symbol("parameters");
const _executionCount = Symbol("executionCount");
const _firstExecution = Symbol("firstExecution");
const _lastExecution = Symbol("lastExecution");
const _executionTimestamps = Symbol("executionTimestamps");
const notEnumerable = [
  _id,
  _currentTimestamp,
  _interval,
  _parameters,
  _executionCount,
  _firstExecution,
  _lastExecution,
  _executionTimestamps
];

module.exports = class StrategyEnvironment {
  constructor(id, currentTimestamp, interval, parameters) {
    assertKnownInterval(interval);

    this[_id] = id;
    this[_currentTimestamp] = currentTimestamp;
    this[_interval] = interval;
    this[_parameters] = parameters;
    this[_executionCount] = 0;
    this[_firstExecution] = undefined;
    this[_lastExecution] = undefined;
    this[_executionTimestamps] = [];

    for (const field of notEnumerable) {
      Object.defineProperty(this, field, {
        enumerable: false
      });
    }
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
};
