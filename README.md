Kryptopus
=========

Cryptocurrency manager

CLI
---

```
Usage: cli [options] [command]

Options:
  -h, --help                                                                                                            output usage information

Commands:
  trading:automation:start                                                                                              Start trading automation
  trading:automation:stop                                                                                               Stop trading automation
  trading:automation:status                                                                                             Display trading automation status
  trading:automation:daemon                                                                                             Trading automation daemon
  trading:entry:create                                                                                                  Create trade entry
  trading:strategy:backtest <interval> <strategy>                                                                       Backtest trading strategy
  exchange:binance:balances <accountName>                                                                               Get Binance balances
  exchange:binance:open_orders <accountName>                                                                            Get Binance open orders
  exchange:binance:informations                                                                                         Display Binance informations
  exchange:kucoin:balances <accountName>                                                                                Get Kucoin balances
  technicalAnalysis:candlestick:collect <exchange> <baseSymbol> <quoteSymbol> <interval> <periodStartAt> <periodEndAt>  Collect candlesticks
  technicalAnalysis:candlestick:check <exchange> <baseSymbol> <quoteSymbol> <interval> <periodStartAt> <periodEndAt>    Check collected candlesticks
  technicalAnalysis:candlestick:display <exchange> <baseSymbol> <quoteSymbol> <interval> <periodStartAt> <periodEndAt>  Display candlesticks
  technicalAnalysis:collector:start                                                                                     Start collector daemon
  technicalAnalysis:collector:status                                                                                    Display collector status
  technicalAnalysis:collector:stop                                                                                      Stop collector daemon
  technicalAnalysis:collector:daemon                                                                                    Collector daemon
  technicalAnalysis:graph:candlestick:display [options] <exchange> <baseSymbol> <quoteSymbol> <interval>                Display graph with candlesticks
  technicalAnalysis:graph:generate [options] <exchange> <baseSymbol> <quoteSymbol> <interval>                           Generate graph
  wallet:balance
  wallet:fromMnemonic
  mnemonic:random
  mnemonic:validate
  mnemonic:seed
  portfolio:balances                                                                                                    Get portfolio balances
  portfolio:estimate_total_amount [options]                                                                             Estimate total amount
  aggregator:cryptocompare:asset_price <base> <quote>                                                                   Get asset price
```

### Display candlestick chart
```bash
./cli technicalAnalysis:graph:candlestick:display binance BTC USDT 1d
```

