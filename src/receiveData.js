import path from 'path';
import cheerio from 'cheerio';
import log from './lib/logger.js';
import {
  genFilename,
  genSrcDirname,
  isLocalResource,
} from './lib/utils.js';

const tags = {
  link: 'href',
  script: 'src',
  img: 'src',
};

export default (html, dest, link) => {
  const url = new URL(link);
  const srcDirname = genSrcDirname(url);
  const $ = cheerio.load(html);
  const resourcePath = path.join(dest, srcDirname);
  const links = Object
    .entries(tags)
    .reduce((acc, [tag, attribute]) => {
      const srcLinks = $(tag).map((i, element) => {
        const $element = $(element);
        const resource = $element.attr(attribute);
        if (resource && isLocalResource(resource, url)) {
          const filename = genFilename(resource);
          const localpath = path.join(srcDirname, filename);
          $element.attr(attribute, localpath);
          const { href } = new URL(resource, url);
          return { href, filepath: path.join(resourcePath, filename) };
        }
        return null;
      }).get();
      return [...acc, ...srcLinks];
    }, []);
  log('Parse html, setting attributes to local resources');
  return { html: $.html(), links };
};
