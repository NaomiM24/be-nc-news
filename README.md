# Naomi's Northcoders News API

This project is a mock news website with interlinked users, topics, articles and comments.

## Getting Started

## Step 1 - Fork and Clone
Pre-requisites: node.js 12.5.0, PostgreSQL 10.10

## Step 2 - Install dependencies

You will need to install the following dependencies:
* chai
* chai-sorted
* mocha
* supertest 
* express
* knex 
* pg



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

```bash
  npm run test
```
## Step 6 - Deployment
The app is available at the following URL:
https://naomi-be-news.herokuapp.com/api

## Available Endpoints
* GET/api: serves up a json representation of all the available endpoints of the api
* GET /api/topics - serves an array of all topics
* GET /api/articles - serves an array of all articles
* GET /api/users/:users - serves a user object with a given username
* GET /api/articles/:article_id - erves an article object with a given article id
* PATCH /api/articles/:article_id - updates an article votes and responds with the updated article object
* POST /api/articles/:article_id/comments - posts a new comment to an article and responds with the posted comment
* GET /api/articles/:article_id/comments - responds with an array of comments for the given article_id
* PATCH /api/comments/:comment_id - updates a comment votes and responds with the updated comment object
* DELETE /api/comments/:comment_id - deletes a comment, responds with status 204 and no content