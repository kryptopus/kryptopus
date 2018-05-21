import solfege from "solfegejs"
import KoaBundle from "solfegejs-koa"
import KoaNunjucksBundle from "solfegejs-koa-nunjucks"
import KryptopusBundle from "./Bundle"

// Create application instance
let application = solfege.factory(`${__dirname}/../config/parameters.yml`);
application.addBundle(new KoaBundle);
application.addBundle(new KoaNunjucksBundle);
application.addBundle(new KryptopusBundle);

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
