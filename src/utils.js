import _ from 'lodash';
import path from 'path';

const isLocalResource = (src, url) => new URL(src, url).origin === url.origin;

const genName = (string, pattern = /\W/g, replacement = '-') => _
  .trim(_.replace(string, pattern, replacement), replacement);

const genSrcDirname = (url) => {
  const { host, pathname } = url;
  const address = `${host}${pathname}`;
  return `${genName(address)}_files`;
};

const genFilename = (resource) => {
  const { dir, name, ext } = path.parse(resource);
  const filename = `${genName(path.join(dir, name))}${ext}`;
  return filename;
};

const genHtmlname = (url) => {
  const { host, pathname } = url;
  const address = `${host}${pathname}`;
  return `${genName(address)}.html`;
};

export {
  isLocalResource,
  genName,
  genFilename,
  genSrcDirname,
  genHtmlname,
};
