import fs from 'fs/promises';
import axios from 'axios';
import Listr from 'listr';

const downloadFiles = (links) => {
  const tasks = links.map(({ url, filepath }) => (
    {
      title: `download ${url}`,
      task: () => axios
        .get(url, { responseType: 'arraybuffer' })
        .then(({ data }) => fs.writeFile(filepath, data)),
    }
  ));
  return new Listr(tasks, { concurrent: true, exitOnError: false }).run();
};

export default downloadFiles;
