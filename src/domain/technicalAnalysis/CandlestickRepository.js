const fs = require("fs").promises;
const level = require("level");
const msgpack = require("msgpack5");

const pack = msgpack();

module.exports = class CandlestickRepository {
  constructor() {
    this.directoryPath = `${__dirname}/../../../data/technicalAnalysis/exchanges`;
  }

  async saveCollection(exchangeName, baseSymbol, quoteSymbol, interval, candlesticks) {
    const operations = [];
    for (const candlestick of candlesticks) {
      operations.push({
        type: "put",
        key: candlestick.openTimestamp,
        value: {
          o: candlestick.openPrice,
          c: candlestick.closePrice,
          l: candlestick.lowestPrice,
          h: candlestick.highestPrice,
          v: candlestick.volume
        }
      });
    }

    const database = await this.getDatabase(exchangeName, baseSymbol, quoteSymbol, interval);
    await database.batch(operations);
    await database.close();
  }

  async getCollection(exchangeName, baseSymbol, quoteSymbol, interval, startTimestamp, endTimestamp) {
    const database = await this.getDatabase(exchangeName, baseSymbol, quoteSymbol, interval);
    const stream = database.createReadStream();

    for await (const chunk of stream) {
      console.log(chunk);
    }
  }

  async getDatabase(exchangeName, baseSymbol, quoteSymbol, interval) {
    await fs.mkdir(this.directoryPath, { recursive: true });

    const databasePath = `${this.directoryPath}/${exchangeName}-${baseSymbol}-${quoteSymbol}-${interval}`;
    const database = level(databasePath, { valueEncoding: pack });

    return database;
  }
};
