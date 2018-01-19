import solfege from "solfegejs"
import ExchangeBundle from "kryptopus-exchange"
import BitstampBundle from "kryptopus-exchange-bitstamp"
import TerminalInterfaceBundle from "kryptopus-terminal-interface"
import TerminalInterfaceBodyBinanceExchangeBundle from "kryptopus-terminal-interface-body-binance-exchange"
import KryptopusBundle from "./Bundle"

// Create application instance
let application = solfege.factory(`${__dirname}/../config/parameters.yml`);
application.addBundle(new ExchangeBundle);
application.addBundle(new BitstampBundle);
application.addBundle(new TerminalInterfaceBundle);
application.addBundle(new TerminalInterfaceBodyBinanceExchangeBundle);
application.addBundle(new KryptopusBundle);


// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
