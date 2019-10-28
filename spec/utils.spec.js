const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
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
  it('returns an empty object when passed an empty array', ()=> {
    expect(makeRefObj([])).to.eql({});
  })
  it('returns one object with a reference key when passed an array with one object', () => {
    expect(makeRefObj([{ article_id: 1, title: 'A' }])).to.eql({ A: 1 })
  })
  it('returns an object with multiple reference keys', () =>{
    expect(makeRefObj([{ article_id: 1, title: 'A' }, {article_id: 2, title: 'B'}])).to.eql({A: 1, B: 2})
  })
});

describe.only('formatComments', () => {
  it('does not mutate the input', () => {
    const input = [];
    expect(formatComments(input)).to.not.equal(input);
  })
  it('returns an empty array when passed an empty array', ()=> {
    const input = [];
    expect(formatComments(input)).to.eql([])
  })
  it('returns a new array with one object when passed one comment', () => {
    const input1 = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }]
    const input2 = {'They\'re not exactly dogs, are they?': 2};
    const expected = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 2,
      author: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389)
    }]
    expect(formatComments(input1, input2)).to.eql(expected)
  })
  it('returns a new array with more than one object when passed more than one comment', () => {
    const input1 = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    }]
    const input2 = {'They\'re not exactly dogs, are they?': 2, 'Living in the shadow of a great man': 12};
    const expected = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 2,
      author: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389)
    }, {
      body:
    'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
  article_id: 12,
  author: 'butter_bridge',
  votes: 14,
  created_at: new Date(1479818163389)
    }]
    expect(formatComments(input1, input2)).to.eql(expected)
  })
});
