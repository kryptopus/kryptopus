import solfege from "solfegejs"
import ExchangeBundle from "kryptopus-exchange"
import KryptopusBundle from "./Bundle"

// Create application instance
let application = solfege.factory(`${__dirname}/../config/parameters.yml`);
application.addBundle(new ExchangeBundle);
application.addBundle(new KryptopusBundle);


// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
