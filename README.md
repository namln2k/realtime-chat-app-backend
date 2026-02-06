## Description

A boilerplate for an authentication and authorization RESTful API server using [Nest](https://github.com/nestjs/nest) and [Passport](https://github.com/jaredhanson/passport)

## Prerequisites

### Node.js

Install [Node.js](https://nodejs.org/) version 20 or higher.

## Project setup

```bash
# Install dependencies
$ npm install
```

```bash
# Set env variables
$ cp .env.example .env

# Edit the env variables if you would like to.
```

### Migrate database schemas

```bash
$ npm run typeorm migration:run
```

### Seed database

```bash
$ npm run seed:run
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
