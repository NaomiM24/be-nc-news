# Naomi's Northcoders News API

## Getting Started

## Step 1 - Fork and Clone
Pre-requisites: node.js, PostgreSQL

## Step 2 - Install dependencies
You will need to install express, knex and pg as dependencies with the following command:

```bash
npm i express knex pg

```

You will need to install chai, chai-sorted, mocha and supertest at developer-dependencies with the following command:
```bash
npm i -D mocha chai chai-sorted supertest

```
or for everything:
```bash
npm i 

```

## Step 3 - Create knexfile 
You will need to create a knexfile. Make sure to add it to `.gitignore`.
If you are on a linux you will need to include yor postgres username and password in the knexfile.

```
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;


const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      user: your_username,
      password: your_password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      user: your_username,
      password: your_password
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```
## Step 4 - Setting up

To set up the seed files
```bash
  npm run seed
```

To set up the databases
```bash
  npm run setup-dbs
```

## Step 5 - Running tests
You can run the tests for the app with the following command:
```bash
npm run test-app

```
Or you can run all tests - including util with:
To set up the seed files
```bash
  npm run test
```
## Step 6 - Deployment
The app is available at the following URL:
https://naomi-be-news.herokuapp.com/api