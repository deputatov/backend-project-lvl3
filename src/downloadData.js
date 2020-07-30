import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import Listr from 'listr';
import log from './logger.js';
import {
  genSrcDirname,
  genHtmlname,
} from './utils.js';

const downloadLinks = (links) => {
  const tasks = links.map(({ href, filepath }) => (
    {
      title: `download ${href}`,
      task: () => axios
        .get(href, { responseType: 'arraybuffer' })
        .then(({ data }) => fs.writeFile(filepath, data)),
    }
  ));
  return new Listr(tasks, { concurrent: true, exitOnError: false }).run();
};

export default (html, links, dest, link) => {
  const url = new URL(link);
  const srcDirname = genSrcDirname(url);
  const htmlFilepath = path.join(dest, genHtmlname(url));
  return fs.writeFile(htmlFilepath, html)
    .then(() => log('Saving the html file locally'))
    .then(() => fs.mkdir(path.join(dest, srcDirname)))
    .then(() => log('Created directory for downloading files'))
    .then(() => downloadLinks(links));
};
