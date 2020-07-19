install: install-deps

run:
	bin/page-loader.js https://lodash.com/

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

debug:
	DEBUG=page-loader,axios,nock make test

lint:
	npx eslint .

publish:
	npm publish --dry-run

.PHONY: test