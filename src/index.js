import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';

export default (dest, url) => {
  console.log(dest, url);
  const { host, pathname } = new URL(url);
  const re = /[^\w]/g;
  const filename = `${host.replace(re, '-')}${pathname.replace(re, '-')}.html`;
  axios
    .get(url)
    .then((response) => fs.writeFile(path.resolve(dest, filename), response.data))
    .catch(console.log);
};
