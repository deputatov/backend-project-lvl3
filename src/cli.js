import commander from 'commander';
import pageLoader from './index.js';

const message = `Page loader downloads the page from the network
and puts it in the specified directory
(by default, in the program launch directory).`;

export default () => {
  commander
    .version('0.0.1')
    .description(message)
    .option('-o, --output <dest>', 'destination path', process.cwd())
    .arguments('<url>')
    .action((url) => {
      pageLoader(commander.output, url);
    })
    .parse(process.argv);
  if (!commander.args.length) commander.help();
};
