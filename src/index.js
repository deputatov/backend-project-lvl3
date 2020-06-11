import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';

export default (dest, url) => {
  const { host, pathname } = new URL(url);
  const re = /[^a-z0-9]/g;
  const filename = `${host.replace(re, '-')}${pathname.replace(re, '-')}.html`;
  axios
    .get(url)
    .then((request) => fs.writeFile(path.resolve(dest, filename), request.data))
    .catch(console.log);
};
