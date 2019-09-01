const _id = Symbol("id");
const _parameters = Symbol("parameters");
const _executionCount = Symbol("executionCount");
const _firstExecution = Symbol("firstExecution");
const _lastExecution = Symbol("lastExecution");
const _executionTimestamps = Symbol("executionTimestamps");
const notEnumerable = [_id, _parameters, _executionCount, _firstExecution, _lastExecution, _executionTimestamps];

module.exports = class StrategyEnvironment {
  constructor(id, parameters) {
    this[_id] = id;
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

  getId() {
    return this[_id];
  }

  getParameters() {
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

  getFirstExecutionTimestamp() {
    return this[_firstExecution];
  }

  getExecutionCount() {
    return this[_executionCount];
  }
};
