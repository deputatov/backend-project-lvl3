/* eslint-disable no-underscore-dangle */
import fs from 'fs/promises';
import os from 'os';
import nock from 'nock';
import path from 'path';
import rimraf from 'rimraf';
import { fileURLToPath } from 'url';
import loadPage from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = 'http://localhost';

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

const readFile = async (filename) => {
  const file = await fs.readFile(getFixturePath(filename), 'utf-8');
  return file;
};

let testpath;

beforeEach(async () => {
  testpath = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

afterEach(async () => {
  await rimraf(testpath, () => {});
});

test('page loader', async () => {
  const data = await readFile('test.html');
  const icon1 = await readFile('/icons/icon1.ico');
  const icon2 = await readFile('/icons/icon2.ico');
  const image1 = await readFile('/images/image1.png');
  const image2 = await readFile('/images/image2.png');
  const script1 = await readFile('/scripts/script1');
  const script2 = await readFile('/scripts/script2');
  const scope = nock(host)
    .get('/icons/icon1.ico')
    .reply(200, icon1)
    .get('/icons/icon2.ico')
    .reply(200, icon2)
    .get('/images/image1.png')
    .reply(200, image1)
    .get('/images/image2.png')
    .reply(200, image2)
    .get('/scripts/script1')
    .reply(200, script1)
    .get('/scripts/script2')
    .reply(200, script2)
    .get('/')
    .reply(200, data);
  await loadPage(testpath, host);
  expect(scope.isDone()).toBe(true);
});
