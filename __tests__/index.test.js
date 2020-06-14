import fs from 'fs/promises';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoader from '../src/index.js';

const fixture = '__tests__/__fixtures__/test.html';

let testpath;

beforeEach(async () => {
  testpath = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('page loader', async () => {
  const data = await fs.readFile(fixture);
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, data);
  await pageLoader(testpath, 'https://ru.hexlet.io/courses');
  expect(scope.isDone()).toBe(true);
});
