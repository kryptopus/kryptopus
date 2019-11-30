const { resolve } = require("path");
const { writeFile, readFile, opendir } = require("fs").promises;
const Position = require("./Position");

module.exports = class PositionRepository {
  constructor(directoryPath) {
    this.directoryPath = resolve(directoryPath);
  }

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
        const position = this.unserialize(content);
        positions.push(position);
      }
    }
    return positions;
  }

  serialize(position) {
    return JSON.stringify(
      {
        id: position.getId()
      },
      undefined,
      2
    );
  }

  unserialize(json) {
    const normalized = JSON.parse(json);
    const { id } = normalized;
    return new Position(id);
  }
};
