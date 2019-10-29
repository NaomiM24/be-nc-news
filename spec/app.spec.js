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
        expect(body.topics).to.be.an('array')
        expect(body.topics.length).to.equal(3)
        expect(body.topics[0]).to.contain.keys(
          'slug', 'description'
        )
      })
    })
    describe('ERRORS', () => {
      it('405 INVALID METHODS', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)[method]('/api/topics')
          .expect(405)
          .then(({body: {msg}})=>{
            expect(msg).to.equal('method not allowed')
          })
        });
        return Promise.all(methodPromises)
      });
    });
  })
  describe('/users', () => {
    it('GET: 200, returns all users', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then(({body}) => {
        expect(body.users).to.be.an('array')
        expect(body.users.length).to.equal(4)
        expect(body.users[0]).to.contain.keys(
          'username','avatar_url','name'
        )
      })
    });
    describe('ERRORS', () => {
      it('405 INVALID METHODS', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)[method]('/api/users')
          .expect(405)
          .then(({body: {msg}})=>{
            expect(msg).to.equal('method not allowed')
          })
        });
        return Promise.all(methodPromises)
      });
    });
    describe('/:username', () => {
      it('GET: 200, returns user with given username', () => {
        return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then(({body}) => {
          expect(body).to.eql({ user: 
            { username: 'icellusedkars',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
              name: 'sam' } })
        })
      });
      describe('ERRORS', () => {
        it('GET: 404 when username does not exist', () => {
          return request(app)
          .get('/api/users/blob')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).to.eql('username does not exist')
          })
        });
        it('405 INVALID METHODS', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)[method]('/api/users/blob')
            .expect(405)
            .then(({body: {msg}})=>{
              expect(msg).to.equal('method not allowed')
            })
          });
          return Promise.all(methodPromises)
        });
      });
    });
  });
})