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

const url = 'http://localhost';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFixtureFile = async (filename) => {
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
  const before = await readFixtureFile('before.html');
  const after = await readFixtureFile('after.html');

  const icon1 = await readFixtureFile('/icons/icon1.ico');
  const icon2 = await readFixtureFile('/icons/icon2.ico');
  const image1 = await readFixtureFile('/images/image1.png');
  const image2 = await readFixtureFile('/images/image2.png');
  const script1 = await readFixtureFile('/scripts/script1');
  const script2 = await readFixtureFile('/scripts/script2');

  nock(url)
    .get('/')
    .reply(200, before)
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
    .reply(200, script2);
  await loadPage(testpath, url);
  const actual = await fs.readFile(path.join(testpath, 'localhost.html'), 'utf-8');
  expect(actual).toBe(after.trim());
});

test('no directory', async () => {
  await expect(loadPage('/nodirectory', url)).rejects.toThrow();
});

test('404', async () => {
  nock(url)
    .get('/')
    .reply(404);
  await expect(loadPage(testpath, url)).rejects.toThrow();
});
