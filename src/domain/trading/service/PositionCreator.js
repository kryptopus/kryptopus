const { v4: generateUuid } = require("uuid");
const Position = require("../Position");

module.exports = class PositionCreator {
  constructor(repository) {
    this.repository = repository;
  }

  async create(entryTacticName, entryTacticParameters, exitTacticName, exitTacticParameters) {
    const id = generateUuid();
    const position = new Position(id, entryTacticName, entryTacticParameters, exitTacticName, exitTacticParameters);

    await this.repository.add(position);

    return position;
  }
};
