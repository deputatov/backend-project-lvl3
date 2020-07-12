// @ts-check
import axios from 'axios';
import path from 'path';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import _ from 'lodash';

const regHTML = /[^\w]/g;
const regFile = /\//g;

const isLocalResource = (src, url) => {
  const myURL = new URL(src, url);
  return myURL.host === url.host;
};

const getReplacedString = (str, re) => _.trim(str.replace(re, '-'), '-');

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
      $('link').each((_, element) => {
        const $element = $(element);
        const attr = $element.attr('href');
        if (isLocalResource(attr, myURL)) {
          const replacedAttr = getReplacedString(attr, regFile);
          const filepath = path.join(directoryname, replacedAttr);
          $element.attr('href', filepath);
          const { href } = new URL(attr, url);
          links.push({ href, fullFilePath: path.join(directorypath, replacedAttr) });
        }
      });

      $('img').each((_, element) => {
        const $element = $(element);
        const src = $element.attr('src');
        if (isLocalResource(src, myURL)) {
          const replacedSrc = getReplacedString(src, regFile);
          const filepath = path.join(directoryname, replacedSrc);
          $element.attr('src', filepath);
          const { href } = new URL(src, url);
          links.push({ href, fullFilePath: path.join(directorypath, replacedSrc) });
        }
      });

      $('script').each((_, element) => {
        const $element = $(element);
        const src = $element.attr('src');
        if (isLocalResource(src, myURL)) {
          const replacedSrc = getReplacedString(src, regFile);
          const filepath = path.join(directoryname, replacedSrc);
          $element.attr('src', filepath);
          const { href } = new URL(src, url);
          links.push({ href, fullFilePath: path.join(directorypath, replacedSrc) });
        }
      });
      fs.writeFile(path.join(dest, filename), $.html());
      return links;
    })
    .then((links) => links.forEach(({ href, fullFilePath }) => axios
      .get(href, { responseType: 'arraybuffer' })
      .then((response) => fs.writeFile(fullFilePath, response.data))));
};
