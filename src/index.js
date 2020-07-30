import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import log from './logger.js';
import { genName } from './utils.js';
import receiveData from './receiveData.js';
import downloadData from './downloadData.js';

import 'axios-debug-log';

export default (dest, link) => axios
  .get(link)
  .then(({ data }) => receiveData(data, dest, link))
  .then(({ html, links }) => downloadData(html, links, dest, link));
