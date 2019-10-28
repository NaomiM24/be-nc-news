const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a new empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([])
  })
  it('returns an array with one converted data when passed an array with one date obect', () => {
    expect(formatDates([1542284514171])).to.eql([new Date(1542284514171)])
  })
  it('returns a new array', () => {
    const input = [1542284514171]
    expect(formatDates(input)).to.not.eql(input)
  })
  it('returns a new array with more than one converted data when passed an array with more than one date obect', () => {
    expect(formatDates([1542284514171, 1416140514171])).to.eql([new Date(1542284514171), new Date(1416140514171)])
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
