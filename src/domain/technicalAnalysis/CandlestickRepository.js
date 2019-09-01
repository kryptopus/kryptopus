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
    const candlesticksByMonth = this.splitCandlesticksByMonth(candlesticks);
    for (const [monthId, candlesticksInMonth] of candlesticksByMonth) {
      const operations = [];
      for (const candlestick of candlesticksInMonth) {
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

      const database = await this.getDatabase(exchangeName, baseSymbol, quoteSymbol, interval, monthId);
      await database.batch(operations);
    }
  }

  async getCollection(exchangeName, baseSymbol, quoteSymbol, interval, startTimestamp, endTimestamp) {
    const databases = await this.getDatabasesForPeriod(
      exchangeName,
      baseSymbol,
      quoteSymbol,
      interval,
      startTimestamp,
      endTimestamp
    );

    const candlesticks = [];
    for (const database of databases) {
      const normalizedCandlesticks = database.createReadStream({
        gte: startTimestamp,
        lt: endTimestamp
      });

      for await (const normalizedCandlestick of normalizedCandlesticks) {
        candlesticks.push(this.denormalizeCandlestick(normalizedCandlestick, interval));
      }
    }
    return candlesticks;
  }

  async getDatabase(exchangeName, baseSymbol, quoteSymbol, interval, monthId) {
    const id = `${monthId}/${exchangeName}-${baseSymbol}-${quoteSymbol}-${interval}`;
    let databaseAccess;

    if (this.databaseAccesses.has(id)) {
      databaseAccess = this.databaseAccesses.get(id);
      clearTimeout(databaseAccess.timeoutId);
    } else {
      const databasePath = `${this.directoryPath}/${id}`;
      await fs.mkdir(databasePath, { recursive: true });
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
      Number(normalized.value.o),
      Number(normalized.value.c),
      Number(normalized.value.l),
      Number(normalized.value.h),
      Number(normalized.value.v)
    );
  }

  splitCandlesticksByMonth(candlesticks) {
    const candlesticksByMonth = new Map();
    for (const candlestick of candlesticks) {
      const { openTimestamp } = candlestick;
      const openDate = new Date(openTimestamp);
      const monthId = this.buildMonthId(openDate);
      let candlesticksInMonth;
      if (candlesticksByMonth.has(monthId)) {
        candlesticksInMonth = candlesticksByMonth.get(monthId);
      } else {
        candlesticksInMonth = [];
        candlesticksByMonth.set(monthId, candlesticksInMonth);
      }
      candlesticksInMonth.push(candlestick);
    }

    return candlesticksByMonth;
  }

  async getDatabasesForPeriod(exchangeName, baseSymbol, quoteSymbol, interval, startTimestamp, endTimestamp) {
    const endDate = new Date(endTimestamp);

    const currentDate = new Date(startTimestamp);
    const databases = [];
    do {
      const monthId = this.buildMonthId(currentDate);
      const database = await this.getDatabase(exchangeName, baseSymbol, quoteSymbol, interval, monthId);
      databases.push(database);

      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    } while (currentDate < endDate);

    return databases;
  }

  buildMonthId(date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  }
};
