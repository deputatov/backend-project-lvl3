import _ from 'lodash';

const isLocalResource = (src, url) => new URL(src, url).origin === url.origin;

const genName = (string, pattern = /\W/g, replacement = '-') => _
  .trim(_.replace(string, pattern, replacement), replacement);

export {
  isLocalResource,
  genName,
};
