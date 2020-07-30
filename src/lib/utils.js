import _ from 'lodash';
import path from 'path';

const genAddress = (url) => {
  const { host, pathname } = url;
  const address = `${host}${pathname}`;
  return address;
};

const genName = (address, pattern = /\W/g, replacement = '-') => _
  .trim(_.replace(address, pattern, replacement), replacement);

const genFilename = (filepath) => {
  const { dir, name, ext } = path.parse(filepath);
  const filename = `${genName(path.join(dir, name))}${ext}`;
  return filename;
};

const genHtmlname = (url) => {
  const address = genAddress(url);
  return `${genName(address)}.html`;
};

const genSrcDirname = (url) => {
  const address = genAddress(url);
  return `${genName(address)}_files`;
};

const isLocalResource = (src, url) => new URL(src, url).origin === url.origin;

export {
  genFilename,
  genHtmlname,
  genSrcDirname,
  isLocalResource,
};
