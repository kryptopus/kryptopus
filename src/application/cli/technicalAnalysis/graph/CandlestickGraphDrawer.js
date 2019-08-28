const readline = require("readline");
const { green, red } = require("colors/safe");
const clearTTY = require("../../util/clearTTY");

module.exports = class CandlestickGraphDrawer {
  draw(candlesticks) {
    clearTTY();

    let minPrice;
    let maxPrice;
    for (const candlestick of candlesticks) {
      if (!minPrice || Number(candlestick.lowestPrice) < minPrice) {
        minPrice = Number(candlestick.lowestPrice);
      }
      if (!maxPrice || Number(candlestick.highestPrice) > maxPrice) {
        maxPrice = Number(candlestick.highestPrice);
      }
    }

    const ttyHeight = process.stdout.rows;
    for (let column = 0; column < candlesticks.length; column++) {
      const candlestick = candlesticks[column];
      this.drawCandlestick(candlestick, column, ttyHeight - 3, minPrice, maxPrice);
    }

    readline.cursorTo(process.stdout, 0, ttyHeight);
  }

  drawCandlestick(candlestick, column, ttyHeight, minPrice, maxPrice) {
    const openPrice = Number(candlestick.openPrice);
    const closePrice = Number(candlestick.closePrice);
    const lowestPrice = Number(candlestick.lowestPrice);
    const highestPrice = Number(candlestick.highestPrice);
    const isMovingUp = openPrice < closePrice;

    const rowPrice = (maxPrice - minPrice) / ttyHeight;
    const openPriceRow = this.computePriceRow(openPrice, minPrice, rowPrice, ttyHeight);
    const closePriceRow = this.computePriceRow(closePrice, minPrice, rowPrice, ttyHeight);
    const lowestPriceRow = this.computePriceRow(lowestPrice, minPrice, rowPrice, ttyHeight);
    const highestPriceRow = this.computePriceRow(highestPrice, minPrice, rowPrice, ttyHeight);

    let bodyTopRow = openPriceRow;
    let bodyBottomRow = closePriceRow;
    if (isMovingUp) {
      bodyTopRow = closePriceRow;
      bodyBottomRow = openPriceRow;
    }

    if (isMovingUp) {
      this.drawColoredCandlestick(green, column, highestPriceRow, bodyTopRow, bodyBottomRow, lowestPriceRow);
    } else {
      this.drawColoredCandlestick(red, column, highestPriceRow, bodyTopRow, bodyBottomRow, lowestPriceRow);
    }
  }

  computePriceRow(price, minPrice, rowPrice, ttyHeight) {
    return ttyHeight - Math.round((price - minPrice) / rowPrice);
  }

  drawColoredCandlestick(color, column, wickTopRow, bodyTopRow, bodyBottomRow, wickBottomRow) {
    this.drawWick(color, column, wickTopRow, bodyTopRow);
    this.drawBody(color, column, bodyTopRow, bodyBottomRow);
    this.drawWick(color, column, bodyBottomRow, wickBottomRow);

    if (wickTopRow < bodyTopRow) {
      readline.cursorTo(process.stdout, column, bodyTopRow);
      if (bodyTopRow === bodyBottomRow) {
        process.stdout.write(color("┷"));
      } else {
        process.stdout.write(color("╽"));
      }
    }

    if (bodyBottomRow < wickBottomRow) {
      readline.cursorTo(process.stdout, column, bodyBottomRow);
      if (bodyTopRow === bodyBottomRow) {
        process.stdout.write(color("┯"));
      } else {
        process.stdout.write(color("╿"));
      }
    }

    if (wickTopRow < bodyTopRow && bodyTopRow === bodyBottomRow && bodyBottomRow < wickBottomRow) {
      readline.cursorTo(process.stdout, column, bodyBottomRow);
      process.stdout.write(color("┿"));
    }
  }

  drawBody(color, column, topRow, bottomRow) {
    if (topRow === bottomRow) {
      readline.cursorTo(process.stdout, column, bottomRow);
      process.stdout.write(color("━"));
      return;
    }

    readline.cursorTo(process.stdout, column, topRow);
    process.stdout.write(color("╻"));
    for (let row = topRow + 1; row < bottomRow; row++) {
      readline.cursorTo(process.stdout, column, row);
      process.stdout.write(color("┃"));
    }
    readline.cursorTo(process.stdout, column, bottomRow);
    process.stdout.write(color("╹"));
  }

  drawWick(color, column, topRow, bottomRow) {
    if (topRow === bottomRow) {
      return;
    }

    readline.cursorTo(process.stdout, column, topRow);
    process.stdout.write(color("╷"));
    for (let row = topRow + 1; row < bottomRow; row++) {
      readline.cursorTo(process.stdout, column, row);
      process.stdout.write(color("│"));
    }
    readline.cursorTo(process.stdout, column, bottomRow);
    process.stdout.write(color("╵"));
  }
};
