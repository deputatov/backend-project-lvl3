// @ts-check
import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import debug from 'debug';
import cheerio from 'cheerio';

const log = debug('page-loader');

const regHTML = /[^\w]/g;
const regFile = /\//g;

const isLocalResource = (src, url) => {
  const myURL = new URL(src, url);
  return myURL.host === url.host;
};

const getReplacedString = (str, re) => _.trim(str.replace(re, '-'), '-');

log('begin');
export default (dest, url) => {
  const myURL = new URL(url);
  const { host, pathname } = myURL;
  const replacedURL = getReplacedString(`${host}${pathname}`, regHTML);
  const filename = `${replacedURL}.html`;
  const directoryname = `${replacedURL}_files`;

  return axios
    .get(url)
    .then(({ data }) => {
      const links = [];
      const $ = cheerio.load(data);
      const directorypath = path.join(dest, directoryname);
      fs.mkdir(directorypath);
      log('create directory %o', directorypath);
      $('link').each((i, element) => {
        const $element = $(element);
        const attr = $element.attr('href');
        if (isLocalResource(attr, myURL)) {
          const replacedAttr = getReplacedString(attr, regFile);
          const filepath = path.join(directoryname, replacedAttr);
          $element.attr('href', filepath);
          log('set attribute %o to %o', attr, filepath);
          const { href } = new URL(attr, url);
          links.push({ href, fullFilePath: path.join(directorypath, replacedAttr) });
        }
      });

      $('img').each((i, element) => {
        const $element = $(element);
        const src = $element.attr('src');
        if (isLocalResource(src, myURL)) {
          const replacedSrc = getReplacedString(src, regFile);
          const filepath = path.join(directoryname, replacedSrc);
          $element.attr('src', filepath);
          log('set attribute %o to %o', src, filepath);
          const { href } = new URL(src, url);
          links.push({ href, fullFilePath: path.join(directorypath, replacedSrc) });
        }
      });

      $('script').each((i, element) => {
        const $element = $(element);
        const src = $element.attr('src');
        if (isLocalResource(src, myURL)) {
          const replacedSrc = getReplacedString(src, regFile);
          const filepath = path.join(directoryname, replacedSrc);
          $element.attr('src', filepath);
          log('set attribute %o to %o', src, filepath);
          const { href } = new URL(src, url);
          links.push({ href, fullFilePath: path.join(directorypath, replacedSrc) });
        }
      });
      const destFolderHTML = path.join(dest, filename);
      fs.writeFile(destFolderHTML, $.html());
      log('write html file %o', destFolderHTML);
      return links;
    })
    .then((links) => links.forEach(({ href, fullFilePath }) => axios
      .get(href, { responseType: 'arraybuffer' })
      .then((response) => fs.writeFile(fullFilePath, response.data))));
};
log('end');
