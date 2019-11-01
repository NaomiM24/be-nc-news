process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;

chai.use(chaiSorted);
const connection = require("../db/connection")

describe('/api', () => {
  after(() => connection.destroy())
  beforeEach(() => {
    return connection.seed.run();
  })
  describe.only('/', () => {
    it('GET: 200, response with a JSON describing all the available endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) =>{
        expect(body.endpoints).to.be.a('object')
      })
    });
    describe('ERRORS', () =>{
      it('405 INVALID METHODS', () => {
        const invalidMethods = ['patch', 'put', 'delete', 'post'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)[method]('/api')
            .expect(405)
            .then(({body: {msg}})=>{
              expect(msg).to.equal('method not allowed')
            })
          });
          return Promise.all(methodPromises)
      })
    })
  });
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
    it('GET: 200, returns a specific topic when passed a paramertic endpoint', () => {
      return request(app)
      .get('/api/topics/mitch')
      .expect(200)
      .then(({body}) => {
        expect(body.topic).to.eql({ slug: 'mitch', description: 'The man, the Mitch, the legend' })
      });
    })
    describe('ERRORS', () => {
      it('405 INVALID METHODS', () => {
        const invalidMethods = ['patch', 'put', 'delete', 'post'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)[method]('/api/topics')
          .expect(405)
          .then(({body: {msg}})=>{
            expect(msg).to.equal('method not allowed')
          })
        });
        return Promise.all(methodPromises)
      });
      it('GET: 404, when passed a topic that does not exist', () => {
        return request(app)
        .get('/api/topics/kitch')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('topic does not exist')
        });
      })
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
    it('GET: 200, returns an array of article objects', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).to.be.an('array')
        expect(body.articles[0]).to.contain.keys(
          'article_id', 'title', 'topic', 'author', 'created_at', 'comment_count'
        )
      })
    })
    it('GET: 200, articles are sorted by "date" by default in descending order', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).to.be.sortedBy('created_at', {descending: true})
      })
    })
    it('GET: 200, articles can be sorted by other columns when passed a valid column as a url sort_by query', () => {
      return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).to.be.sortedBy('author', {descending: true})
      })
    })
    it('GET: 200, articles  can be ordered in ascending order if passed as a url "order" query', () => {
      return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).to.be.sortedBy('created_at', {ascending: true})
      })
    })
    it('GET: 200, accepts a query that filters the articles by an author username', () => {
      return request(app)
      .get('/api/articles?author=butter_bridge')
      .expect(200)
      .then(({body}) => {
        expect(body.articles.length).to.equal(3)
        expect(body.articles).to.eql([ { article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '2018-11-15T12:21:54.171Z',
          comment_count: '13' },
        { article_id: 9,
          title: 'They\'re not exactly dogs, are they?',
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '1986-11-23T12:21:54.171Z',
          comment_count: '2' },
        { article_id: 12,
          title: 'Moustache',
          topic: 'mitch',
          author: 'butter_bridge',
          created_at: '1974-11-26T12:21:54.171Z',
          comment_count: '0' } ])
      })
    })
    it('GET: 200, accepts a query that filters the articles by a topic', () => {
      return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({body}) => {
        expect(body.articles.length).to.equal(1)
        expect(body.articles).to.eql([ { article_id: 5,
          title: 'UNCOVERED: catspiracy to bring down democracy',
          topic: 'cats',
          author: 'rogersop',
          created_at: "2002-11-19T12:21:54.171Z",
          comment_count: '2' } ])
      })
    })
    it('GET: 200, articles can be filtered by topic and username at the same time', () => {
      return request(app)
      .get('/api/articles?topic=mitch&author=rogersop')
      .expect(200)
      .then(({body}) => {
        expect(body.articles.length).to.equal(2)
        expect(body.articles).to.eql([ { article_id: 4,
          title: 'Student SUES Mitch!',
          topic: 'mitch',
          author: 'rogersop',
          created_at: '2006-11-18T12:21:54.171Z',
          comment_count: '0' },
        { article_id: 10,
          title: 'Seven inspirational thought leaders from Manchester UK',
          topic: 'mitch',
          author: 'rogersop',
          created_at: '1982-11-24T12:21:54.171Z',
          comment_count: '0' } ])
      })
    })
    it('GET: 200, when filter by a username that exists but has no articles associated with it, returns []', () => {
      return request(app)
      .get('/api/articles?author=lurker')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).to.eql([])
      })
    })
    it('GET: 200, when filter by a valid topic that has no articles', () => {
      return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).to.eql([])
      })
    })
    describe('ERRORS', () => {
      it('405 INVALID METHODS', () => {
        const invalidMethods = ['patch', 'put', 'delete', 'post'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)[method]('/api/articles')
            .expect(405)
            .then(({body: {msg}})=>{
              expect(msg).to.equal('method not allowed')
            })
          });
          return Promise.all(methodPromises)
      })
      it('GET: 400, when sort_by passed invalid column name', () => {
        return request(app)
        .get('/api/articles?sort_by=invalid')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.equal('column "invalid" does not exist')
        })
      })
      it('GET: 400, when order passed something other than asc/desc', () => {
        return request(app)
        .get('/api/articles?order=maybe')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.equal('Order method not approved')
        })
      })
      it('GET: 404, when filter by a username that does not exist', () => {
        return request(app)
        .get('/api/articles?author=maybe')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('username does not exist')
        })
      })
      it('GET: 404, when filter by a topic that does not exist', () => {
        return request(app)
        .get('/api/articles?topic=dogs')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('topic does not exist')
        })
      })
      it('GET: 404, when filter by a topic that does not exist but by a username that does', () => {
        return request(app)
        .get('/api/articles?topic=dogs&author=rogersop')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('topic does not exist')
        })
      })
      it('GET: 404, when filter by a topic that does exist but by a username that does not', () => {
        return request(app)
        .get('/api/articles?topic=mitch&author=bobby')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('username does not exist')
        })
      })
      it('GET: 404, when filter by both topic and username that do not exist', () => {
        return request(app)
        .get('/api/articles?topic=mitch&author=bobby')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('username does not exist')
        })
      })
    })
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
    it('PATCH: 200 when inc_votes has no inc_votes property there is a default value of 0', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({msg: 'HELLO!!'})
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
          comment_count: '13' }})
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
            expect(body.comment).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body')
          });
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
      it('GET: 200, returns an empty array when an article id has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
          expect(body.comments).to.eql([])
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
  describe('/comments/:comment_id', () => {
    it('PATCH 200, an object updates the votes on a comment and response with the updated comment', () => {
      return request(app)
      .patch('/api/comments/1')
      .send({inc_votes: 20})
      .expect(200)
      .then(({body}) => { 
        expect(body.comment).to.eql({ comment_id: 1,
          author: 'butter_bridge',
          article_id: 9,
          votes: 36,
          created_at: '2017-11-22T12:36:03.389Z',
          body: 'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!' } )
      })
    })
    it('PATCH: 200 when the request body does not have a inc_votes property it defaults to 0', () => {
        return request(app)
        .patch('/api/comments/2')
        .send({body: 5})
        .expect(200)
        .then(({body}) => {
         expect(body.comment).to.eql({ comment_id: 2,
          author: 'butter_bridge',
          article_id: 1,
          votes: 14,
          created_at: '2016-11-22T12:36:03.389Z',
          body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.' 
          })
        })
      })
    it('DELETE 204, deletes a comment by comment_id and respond with no content', () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204)
    })
    describe('ERRORS', () => {
      it('405 INVALID METHODS with article_id', () => {
        const invalidMethods = ['put', 'get', 'post'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)[method]('/api/comments/3')
          .expect(405)
          .then(({body: {msg}})=>{
            expect(msg).to.equal('method not allowed')
          })
        });
        return Promise.all(methodPromises)
      });
      it('PATCH 404, when passed a comment id that does not exist', () => {
        return request(app)
        .patch('/api/comments/3463')
        .send({inc_votes: 55})
        .expect(404)
        .then(({body}) => {
          expect(body.msg).to.equal('comment does not exist')
        })
      });
      it('PATCH 400, when passed an invalid comment id', () => {
        return request(app)
        .patch('/api/comments/twenty')
        .send({inc_votes: 55})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.equal('invalid input syntax for integer: "twenty"')
        })
      });
      it('PATCH: 400 when inc_votes is invalid', () => {
        return request(app)
        .patch('/api/comments/3')
        .send({inc_votes: 'nomorevotes4u'})
        .expect(400)
        .then(({body}) => {
          expect(body.msg).to.eql('invalid input syntax for integer: "NaN"')
          })
      });
      it('DELETE: 400 when there is an invalid comment_id', () => {
        return request(app)
        .delete('/api/comments/hiya')
        .expect(400)
        .then(({body}) =>{
          expect(body.msg).to.equal('invalid input syntax for integer: "hiya"')
         })
      })
      it('DELETE: 404 when the comment_id does not exist', () => {
        return request(app)
        .delete('/api/comments/2527')
        .expect(404)
        .then(({body}) =>{
        expect(body.msg).to.equal('comment does not exist')
       })
      })
    });
  });
})
