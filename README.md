## Description

A boilerplate for an authentication and authorization RESTful API server using [Nest](https://github.com/nestjs/nest) and [Passport](https://github.com/jaredhanson/passport)

## Prerequisites

### Node.js

Install [Node.js](https://nodejs.org/) version 20 or higher.

### Yarn

Install [Yarn](https://yarnpkg.com/) globally if not already installed:

```bash
$ npm install -g yarn
```

## Project setup

```bash
# Install dependencies
$ yarn install
```

```bash
# Set env variables
$ cp .env.example .env

# Edit the env variables if you would like to.
```

### Migrate database schemas

```bash
$ yarn typeorm migration:run
```

### Seed database

```bash
$ yarn seed:run

```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
