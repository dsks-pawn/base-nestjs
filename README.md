# base-nestjs-be

## Description

This is project folder of Base Nestjs API

If you running docker in localhost:
Domain

- API: localhost:8084
- DB: localhost:3306

## Installation

```bash
# build docker
cp bin/local/.env.example .env
cp bin/local/docker-compose.yml.local docker-compose.yml
cp bin/local/Dockerfile.local Dockerfile
docker network create base-nestjs-common-network
docker-compose up -d --build

# install node_modules inside docker
docker exec -it base_nestjs_be bash
npm i
npm run build
npm run migration:run
npm run seed:run

```

## Running the app

```bash
# connect to docker
docker exec -it base_nestjs_be bash

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
