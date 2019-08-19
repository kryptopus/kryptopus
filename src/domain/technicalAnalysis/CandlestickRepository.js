const fs = require("fs").promises;
const level = require("level");
const msgpack = require("msgpack5");

const pack = msgpack();

module.exports = class CandlestickRepository {
  async saveCollection(exchangeName, baseSymbol, quoteSymbol, interval, candlesticks) {
    const directoryPath = `${__dirname}/../../../data/technicalAnalysis/exchanges`;
    const databasePath = `${directoryPath}/${exchangeName}-${baseSymbol}-${quoteSymbol}-${interval}`;

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

    await fs.mkdir(directoryPath, { recursive: true });
    const database = level(databasePath, { valueEncoding: pack });
    await database.batch(operations);
    await database.close();
  }
};
