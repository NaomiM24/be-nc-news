process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;

chai.use(chaiSorted);
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
  describe('/articles', () => {
    // it('GET: 200, returns an array of article objects', () => {
    //   return request(app)
    //   .get('/api/articles')
    // })
    describe('/:article_id', () => {
    it('GET 200, returns an article object with author as the username from users table and comment_count which is the total count of all comments with this article_id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
          expect(body).to.eql({article: { 
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: "2018-11-15T12:21:54.171Z",
            comment_count: '13' }});
      });
    });
    it('PATCH: 200, accepts an object to update votes property and returns updated article', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({inc_votes: 10})
      .expect(200)
      .then(({body}) => {
        expect(body).to.eql({article: { 
          article_id: 1,
          title: 'Living in the shadow of a great man',
          body: 'I find this existence challenging',
          votes: 110,
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: "2018-11-15T12:21:54.171Z",
          comment_count: '13' }});
      })
    })
    describe('ERRORS /:article_id', () => {
      it('405 INVALID METHODS with article_id', () => {
        const invalidMethods = ['put', 'delete'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)[method]('/api/articles/3')
          .expect(405)
          .then(({body: {msg}})=>{
            expect(msg).to.equal('method not allowed')
          })
        });
        return Promise.all(methodPromises)
      });
      it('GET: 404 when article id does not exist', () => {
        return request(app)
          .get('/api/articles/194')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).to.eql('article does not exist')
          })
      });
      it('GET: 400 when article id is invalid', () => {
        return request(app)
        .get('/api/articles/helpmeplease')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.eql('invalid input syntax for integer: "helpmeplease"')
          })
      })
      it('PATCH: 404 when article id does not exist', () => {
        return request(app)
          .patch('/api/articles/1941')
          .send({inc_votes: 10})
          .expect(404)
          .then(({body}) => {
            expect(body.msg).to.eql('article does not exist')
          })
      });
      it('PATCH: 400 when article id is invalid', () => {
        return request(app)
        .patch('/api/articles/boooop')
        .send({inc_votes: -10})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.eql('invalid input syntax for integer: "boooop"')
          })
      });
      it('PATCH: 400 when inc_votes is invalid', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 'hi'})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.eql('invalid input syntax for integer: "NaN"')
          })
      });
      it('PATCH: 400 when inc_votes includes a different property', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({msg: 'HELLO!!'})
        .expect(400)
        .then(({body}) => {
         expect(body.msg).to.equal("Invalid property on request body")
          })
      })
    });
    describe('/comments', () => {
      it('POST: 201, accepts an object with a username and body and returns posted comment', () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: 'rogersop', 
            body: 'i disagree with you'
          })
          .expect(201)
          .then(({body}) => {
            expect(body.comment).to.equal('i disagree with you')
          })
      });
      it('GET: 200, returns an array of comments for a given article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
          expect(body.comments).to.be.an('array')
          if (body.comments[0]){ 
            expect(body.comments[0]).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body')
          }
        })
      })
      it('GET: 200, comments are sorted by default by "created_at" in descending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
          expect(body.comments).to.be.sortedBy('created_at', {descending: true})
        })
      })
      it('GET: 200, comments can be sorted by other columns when passed a valid column as a url "sort_by" query', () => {
        return request(app)
        .get('/api/articles/1/comments?sort_by=votes')
        .expect(200)
        .then(({body}) => {
          expect(body.comments).to.be.sortedBy('votes', {descending: true})
        })
      });
      it('GET: 200, comments can be ordered in ascending order if passed as a url "order"" query', () => {
        return request(app)
        .get('/api/articles/1/comments?order=asc')
        .expect(200)
        .then(({body}) => {
          expect(body.comments).to.be.sortedBy('created_at', {asc: true})
        })
      })
      describe('ERRORS /:article_id/comments', () => {
        it('405 INVALID METHODS with article_id', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)[method]('/api/articles/3/comments')
            .expect(405)
            .then(({body: {msg}})=>{
              expect(msg).to.equal('method not allowed')
            })
          });
          return Promise.all(methodPromises)
        });
        it('POST: 404 when article id does not exist', () => {
          return request(app)
            .post('/api/articles/1941/comments')
            .send({
              username: 'rogersop', 
              body: 'i disagree with you'
            })
            .expect(404)
            .then(({body}) => {
              expect(body.msg).to.equal('insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"')
            })
        });
        it('POST: 400, when article_id is invalid', () => {
          return request(app)
          .post('/api/articles/three/comments')
          .send({
            username: 'rogersop', 
            body: 'i disagree with you'
          })
          .expect(400)
          .then(({body}) => {
            expect(body.msg).to.equal('invalid input syntax for integer: "three"')
            })
        });
        it('POST: 400, when there is a missing property on request body', () => {
          return request(app)
          .post('/api/articles/3/comments')
          .send({
            body: 'i disagree with you'
          })
          .expect(400)
          .then(({body}) => {
            expect(body.msg).to.equal('Missing property on request body')
            })
        });
        it('POST: 404, when there is a username that does not exist', () => {
          return request(app)
          .post('/api/articles/3/comments')
          .send({
            username: 'notarealuser',
            body: 'i disagree with you'
          })
          .expect(404)
          .then(({body}) => {
            expect(body.msg).to.equal('insert or update on table "comments" violates foreign key constraint "comments_author_foreign"')
            })
        });
        it('GET: 400, when there is an invalid article_id', () => {
          return request(app)
          .get('/api/articles/three/comments')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).to.equal('invalid input syntax for integer: "three"')
            })
        })
        it('GET: 404 when article id does not exist', () => {
          return request(app)
            .get('/api/articles/1941/comments')
            .expect(404)
            .then(({body}) => {
              expect(body.msg).to.equal('article does not exist')
            })
        });
        it('GET: 400, when sort_by passed invalid column name', () => {
          return request(app)
          .get('/api/articles/1/comments?sort_by=invalid')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).to.equal('column "invalid" does not exist')
          })
        })
        it('GET: 400, when order passed something other than asc/desc', () => {
          return request(app)
          .get('/api/articles/1/comments?order=cry')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).to.equal('Order method not approved')
          })
        })
      });
    });
  });
});
})