process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const {expect} = require("chai");
const connection = require("../connection")

describe('/api', () => {
  after(() => connection.destroy())
  beforeEach(() => {
    return connection.seed.run();
  })
  describe('/topics', () => { 
    it('GET: 200, returns all topics', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({body}) => {
        console.log(body.topics)
        expect(body.topics).to.be.an('array')
        expect(body.topics.length).to.equal(3)
      })
    })
  })
})