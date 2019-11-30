const { v4: generateUuid } = require("uuid");
const Position = require("../Position");

module.exports = class PositionService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(entryTactic, exitTactic) {
    const id = generateUuid();
    const position = new Position(id, entryTactic, exitTactic);

    await this.repository.add(position);

    return position;
  }
};
