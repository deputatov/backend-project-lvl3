install: install-deps

run:
	bin/nodejs-package.js https://ru.hexlet.io/courses

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test