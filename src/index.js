import fs from 'fs/promises';
import path from 'path';
import trim from 'lodash/trim.js';
import axios from 'axios';
import debug from 'debug';
import Listr from 'listr';
import cheerio from 'cheerio';
import 'axios-debug-log';

const log = debug('page-loader');

const regHTML = /[^\w]/g;
const regFile = /\//g;

const tags = {
  link: 'href',
  script: 'src',
  img: 'src',
};

const isLocalResource = (src, url) => {
  const myURL = new URL(src, url);
  return myURL.origin === url.origin;
};

const getReplacedString = (str, re) => trim(str.replace(re, '-'), '-');

export default (dest, url) => {
  const myURL = new URL(url);
  const { host, pathname } = myURL;
  const replacedURL = getReplacedString(`${host}${pathname}`, regHTML);
  const filename = `${replacedURL}.html`;
  const directoryname = `${replacedURL}_files`;
  const links = [];
  return axios
    .get(url)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const directorypath = path.join(dest, directoryname);
      // log('create directory %o', directorypath);
      Object.entries(tags).map(([tag, attribute]) => $(tag).each((_, element) => {
        const $element = $(element);
        const resource = $element.attr(attribute);
        if (resource && isLocalResource(resource, myURL)) {
          const replacedAttr = getReplacedString(resource, regFile);
          const filepath = path.join(directoryname, replacedAttr);
          $element.attr(attribute, filepath);
          const { href } = new URL(resource, myURL);
          links.push({ href, fullFilePath: path.join(directorypath, replacedAttr) });
        }
      }));
      const destFolderHTML = path.join(dest, filename);
      fs.writeFile(destFolderHTML, $.html());
      log('write html file %o', destFolderHTML);
    })
    .then(() => {
      const directorypath = path.join(dest, directoryname);
      fs.mkdir(directorypath);
      const tasks = links.map(({ href, fullFilePath }) => (
        {
          title: `download ${href}`,
          task: () => axios
            .get(href, { responseType: 'arraybuffer' })
            .then(({ data }) => fs.writeFile(fullFilePath, data)),
        }
      ));
      const listr = new Listr(tasks, { concurrent: true, exitOnError: false });
      return listr.run();
    });
};
