import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import log from './debug.js';
import getData from './receiveData.js';
import { genName } from './utils.js';
import downloadFiles from './loadFiles.js';

import 'axios-debug-log';

export default (dest, url) => {
  const myURL = new URL(url);
  const { host, pathname } = myURL;
  const name = genName(`${host}${pathname}`);
  const srcDirname = `${name}_files`;
  const htmlFilepath = path.join(dest, `${name}.html`);
  return axios
    .get(url)
    .then(({ data }) => getData(data, dest, srcDirname, myURL))
    .then(({ html, links }) => fs.writeFile(htmlFilepath, html).then(() => {
      log('Saving the html file locally');
      return links;
    }))
    .then((links) => fs.mkdir(path.join(dest, srcDirname)).then(() => {
      log('Created directory for downloading files');
      return links;
    }))
    .then((links) => downloadFiles(links))
    .then(() => log('Files downloaded'));
};
