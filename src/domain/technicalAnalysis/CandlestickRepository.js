const fs = require("fs").promises;
const level = require("level");
const msgpack = require("msgpack5");
const Candlestick = require("./Candlestick");
const convertIntervalToMilliseconds = require("../util/convertIntervalToMilliseconds");

const pack = msgpack();

module.exports = class CandlestickRepository {
  constructor() {
    this.directoryPath = `${__dirname}/../../../data/technicalAnalysis/exchanges`;
    this.databaseAccesses = new Map();
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
  }

  async getCollection(exchangeName, baseSymbol, quoteSymbol, interval, startTimestamp, endTimestamp) {
    const database = await this.getDatabase(exchangeName, baseSymbol, quoteSymbol, interval);
    const normalizedCandlesticks = database.createReadStream({
      gte: startTimestamp,
      lt: endTimestamp
    });

    const candlesticks = [];
    for await (const normalizedCandlestick of normalizedCandlesticks) {
      candlesticks.push(this.denormalizeCandlestick(normalizedCandlestick, interval));
    }

    return candlesticks;
  }

  async getDatabase(exchangeName, baseSymbol, quoteSymbol, interval) {
    const id = `${exchangeName}-${baseSymbol}-${quoteSymbol}-${interval}`;
    let databaseAccess;

    if (this.databaseAccesses.has(id)) {
      databaseAccess = this.databaseAccesses.get(id);
      clearTimeout(databaseAccess.timeoutId);
    } else {
      await fs.mkdir(this.directoryPath, { recursive: true });
      const databasePath = `${this.directoryPath}/${id}`;
      const database = level(databasePath, { valueEncoding: pack });

      databaseAccess = { database };
      this.databaseAccesses.set(id, databaseAccess);
    }

    databaseAccess.timeoutId = setTimeout(() => {
      databaseAccess.database.close();
      this.databaseAccesses.delete(id);
    }, 1000 * 1);

    return databaseAccess.database;
  }

  denormalizeCandlestick(normalized, interval) {
    return new Candlestick(
      Number(normalized.key),
      Number(normalized.key) + convertIntervalToMilliseconds(interval) - 1,
      normalized.value.o,
      normalized.value.c,
      normalized.value.l,
      normalized.value.h,
      normalized.value.v
    );
  }
};
