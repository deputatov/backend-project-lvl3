import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import debug from 'debug';
import Listr from 'listr';
import cheerio from 'cheerio';
import 'axios-debug-log';

const log = debug('page-loader');

const tags = { link: 'href', script: 'src', img: 'src' };

const isLocalResource = (src, url) => new URL(src, url).origin === url.origin;

const getName = (string, pattern = /\W/g, replacement = '-') => _.trim(_.replace(string, pattern, replacement), replacement);

const getParsedHTMLAndLinks = (data, dest, srcDirname, myURL) => {
  log('parse html, setting attributes to local resources');
  const links = [];
  const $ = cheerio.load(data);
  const resourcePath = path.join(dest, srcDirname);
  Object.entries(tags).map(([tag, attribute]) => $(tag).each((i, element) => {
    const $element = $(element);
    const resource = $element.attr(attribute);
    if (resource && isLocalResource(resource, myURL)) {
      const { dir, name, ext } = path.parse(resource);
      const filename = `${getName(path.join(dir, name))}${ext}`;
      const localpath = path.join(srcDirname, filename);
      $element.attr(attribute, localpath);
      const { href: url } = new URL(resource, myURL);
      links.push({ url, filepath: path.join(resourcePath, filename) });
    }
  }));
  return { html: $.html(), links };
};

const downloadFiles = (links) => {
  log('download files');
  const tasks = links.map(({ url, filepath }) => (
    {
      title: `download ${url}`,
      task: () => axios
        .get(url, { responseType: 'arraybuffer' })
        .then(({ data }) => fs.writeFile(filepath, data)),
    }
  ));
  return new Listr(tasks, { concurrent: true, exitOnError: false }).run();
};

export default (dest, url) => {
  const myURL = new URL(url);
  const { host, pathname } = myURL;
  const name = getName(`${host}${pathname}`);
  const srcDirname = `${name}_files`;
  const htmlFilepath = path.join(dest, `${name}.html`);
  return axios
    .get(url)
    .then(({ data }) => getParsedHTMLAndLinks(data, dest, srcDirname, myURL))
    .then(({ html, links }) => {
      log('writes data to the html file');
      return fs.writeFile(htmlFilepath, html).then(() => links);
    })
    .then((links) => {
      log('created directory for downloading files');
      return fs.mkdir(path.join(dest, srcDirname)).then(() => links);
    })
    .then((links) => downloadFiles(links));
};
