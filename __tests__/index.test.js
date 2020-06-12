import nock from 'nock';
import { promises as fs } from 'fs';
import pageLoader from '../src/index.js';

const fixture = '__tests__/__fixtures__/test.html';

test('page loader', async () => {
  const data = await fs.readFile(fixture);
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, data);
  await pageLoader('/tmp', 'https://ru.hexlet.io/courses');
  expect(scope.isDone()).toBe(true);
});
