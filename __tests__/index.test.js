import nock from 'nock';
import mock from 'mock-fs';
import pageLoader from '../src/index.js';

beforeEach(() => {
  mock({
    '/testpath': {},
  });
});

test('page loader', async () => {
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200);
  await pageLoader('/testpath', 'https://ru.hexlet.io/courses');
  expect(scope.isDone()).toBe(true);
});

afterEach(mock.restore);
