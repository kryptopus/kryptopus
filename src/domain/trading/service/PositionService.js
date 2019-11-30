const { v4: generateUuid } = require("uuid");
const Position = require("../Position");

module.exports = class PositionService {
  async create(entryTactic, exitTactic) {
    const id = generateUuid();
    return new Position(id, entryTactic, exitTactic);
  }
};
