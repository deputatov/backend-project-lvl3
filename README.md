# Project "Page Loader"

![Node CI](https://github.com/deputatov/backend-project-lvl3/workflows/Node%20CI/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/3c411d4d53b08ce2e2ac/maintainability)](https://codeclimate.com/github/deputatov/backend-project-lvl3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3c411d4d53b08ce2e2ac/test_coverage)](https://codeclimate.com/github/deputatov/backend-project-lvl3/test_coverage)

Project [backend-project-lvl3](https://ru.hexlet.io/professions/backend/projects/4)

Mentor [Roman Pushkov](https://ru.hexlet.io/u/aenglisc)

## Setup

```
$ make install
```

## Run test

```
$ make test
```

## Install

```
$ sudo npm link
```

## Usage

### CLI

```
$ page-loader /tmp/ https://lodash.com
```

<p align="center"> <img width=auto height=auto src="gif/usage.gif"> </p>

### Debug
```
$ DEBUG=page-loader,axios page-loader https://lodash.com
```

<p align="center"> <img width=auto height=auto src="gif/debug.gif"> </p>

### Errors

<p align="center"> <img width=auto height=auto src="gif/error.gif"> </p>