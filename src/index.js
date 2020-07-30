import axios from 'axios';
import receiveData from './receiveData.js';
import downloadData from './downloadData.js';

import 'axios-debug-log';

export default (dest, link) => axios
  .get(link)
  .then(({ data }) => receiveData(data, dest, link))
  .then(({ html, links }) => downloadData(html, links, dest, link));
