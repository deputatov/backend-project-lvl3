import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import debug from 'debug';
import Listr from 'listr';
import cheerio from 'cheerio';
import 'axios-debug-log';

const log = debug('page-loader');

const tags = {
  link: 'href',
  script: 'src',
  img: 'src',
};

const isLocalResource = (src, url) => {
  const myURL = new URL(src, url);
  return myURL.origin === url.origin;
};

const getReplacedString = (string, pattern = /\W/g, replacement = '-') => _.trim(_.replace(string, pattern, replacement), replacement);

export default (dest, url) => {
  const myURL = new URL(url);
  const { host, pathname } = myURL;
  const replacedURL = getReplacedString(`${host}${pathname}`);
  const filename = `${replacedURL}.html`;
  const directoryname = `${replacedURL}_files`;
  const links = [];
  return axios
    .get(url)
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const directorypath = path.join(dest, directoryname);
      Object.entries(tags).map(([tag, attribute]) => $(tag).each((i, element) => {
        const $element = $(element);
        const resource = $element.attr(attribute);
        if (resource && isLocalResource(resource, myURL)) {
          const { dir, name, ext } = path.parse(resource);
          const newName = `${getReplacedString(path.join(dir, name))}${ext}`;
          const filepath = path.join(directoryname, newName);
          $element.attr(attribute, filepath);
          const { href } = new URL(resource, myURL);
          links.push({ href, fullFilePath: path.join(directorypath, newName) });
        }
      }));
      const destFolderHTML = path.join(dest, filename);
      fs.writeFile(destFolderHTML, $.html());
      log('write html file %o', destFolderHTML);
    })
    .then(() => fs.mkdir(path.join(dest, directoryname)))
    .then(() => {
      const tasks = links.map(({ href, fullFilePath }) => (
        {
          title: `download ${href}`,
          task: () => axios
            .get(href, { responseType: 'arraybuffer' })
            .then(({ data }) => fs.writeFile(fullFilePath, data)),
        }
      ));
      return new Listr(tasks, { concurrent: true, exitOnError: false }).run();
    });
};
