const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe.only('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([])
  })
  it('returns a new array', () => {
    const input = []
    expect(formatDates(input)).to.not.equal(input)
  })
  it('returns an array with one converted date when passed an array with one date obect', () => {
    const input = [{ title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100
  }];
    expect(formatDates(input)).to.eql([{ title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: new Date(1542284514171),
    votes: 100
  }])
  })
  it('returns a new array', () => {
    const input = [{ title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100 
  }];
    expect(formatDates(input)).to.not.eql(input)
  })
  it('returns a new array with more than one converted data when passed an array with more than one date obect', () => {
    const input = [{ title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100
  },
  {
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: 1289996514171,
    }]
    expect(formatDates(input)).to.eql([{ title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: new Date(1542284514171),
    votes: 100
  }, { title: 'Eight pug gifs that remind me of mitch',
    topic: 'mitch',
    author: 'icellusedkars',
    body: 'some gifs',
    created_at: new Date(1289996514171),
  }]);
  })
});

describe('makeRefObj', () => {
  it('rteurns an empty object when passed an empty array', ()=> {
    expect(makeRefObj([])).to.eql({});
  })
  it('returns one object with a reference key when passed an array with one object', () => {
    expect(makeRefObj([{ article_id: 1, title: 'A' }])).to.eql({ A: 1 })
  })
  it('returns an object with multiple reference keys', () =>{
    expect(makeRefObj([{ article_id: 1, title: 'A' }, {article_id: 2, title: 'B'}])).to.eql({A: 1, B: 2})
  })
});

describe('formatComments', () => {});
