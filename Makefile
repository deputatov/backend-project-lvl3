install: install-deps

run:
	bin/nodejs-package.js http://lodash.com 

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
	npm publish

.PHONY: test