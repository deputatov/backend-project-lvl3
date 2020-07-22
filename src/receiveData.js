import path from 'path';
import cheerio from 'cheerio';
import log from './debug.js';
import { genName, isLocalResource } from './utils.js';

const tags = {
  link: 'href',
  script: 'src',
  img: 'src',
};

const getData = (html, dest, srcDirname, myURL) => {
  const $ = cheerio.load(html);
  const resourcePath = path.join(dest, srcDirname);
  const links = Object
    .entries(tags)
    .reduce((acc, [tag, attribute]) => {
      const arr = $(tag).map((i, element) => {
        const $element = $(element);
        const resource = $element.attr(attribute);
        if (resource && isLocalResource(resource, myURL)) {
          const { dir, name, ext } = path.parse(resource);
          const filename = `${genName(path.join(dir, name))}${ext}`;
          const localpath = path.join(srcDirname, filename);
          $element.attr(attribute, localpath);
          const { href: url } = new URL(resource, myURL);
          return { url, filepath: path.join(resourcePath, filename) };
        }
        return null;
      }).get();
      return [...acc, ...arr];
    }, []);
  log('Parse html, setting attributes to local resources');
  return { html: $.html(), links };
};

export default getData;
