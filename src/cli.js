import commander from 'commander';
import { createRequire } from 'module';
import loadPage from './index.js';

const require = createRequire(import.meta.url);

const { version } = require('../package.json');

const message = `Page loader downloads the page from the network
and puts it in the specified directory
(by default, in the program launch directory).`;

export default () => {
  commander
    .version(version)
    .description(message)
    .option('-o, --output <dest>', 'destination path', process.cwd())
    .arguments('<url>')
    .action((url) => {
      const dest = commander.output;
      loadPage(dest, url)
        .then(() => console.log(`\npage ${url} has been downloaded to ${dest}`))
        .catch((error) => {
          console.error(error.message);
          process.exit(1);
        });
    })
    .parse(process.argv);
};
