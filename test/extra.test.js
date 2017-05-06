const extra = require('../lib/extra');

describe('extra', () => {
  describe('when there is no arguments', () => {
    describe('load arguments', () => {
      beforeEach(() => {
        extra.load(['node', 'index.js']);
      });

      it('should load none arguments', () => {
        expect(extra.params()).toEqual({});
      });
    });
  });

  describe('when there is a non known argument', () => {
    describe('load arguments', () => {
      beforeEach(() => {
        extra.load(['node', 'index.js', 'best']);
      });

      it('should load none arguments', () => {
        expect(extra.params()).toEqual({});
      });
    });
  });

  describe('when there is --no-emoji argument', () => {
    describe('load arguments', () => {
      beforeEach(() => {
        extra.load(['node', 'index.js', '--no-emoji']);
      });

      it('should create noEmoji param with value true', () => {
        expect(extra.params()).toEqual({noEmoji: true});
      });
    });
  });

  describe('when there is --before argument', () => {
    describe('load arguments', () => {
      beforeEach(() => {
        extra.load(['node', 'index.js', '--before', '2017-01-01']);
      });

      it('should create before param with value 2017-01-01', () => {
        expect(extra.params()).toEqual({before: '2017-01-01'});
      });
    });
  });

  describe('when there is --after argument', () => {
    describe('load arguments', () => {
      beforeEach(() => {
        extra.load(['node', 'index.js', '--after', '2017-01-31']);
      });

      it('should create after param with value 2017-01-31', () => {
        expect(extra.params()).toEqual({after: '2017-01-31'});
      });
    });
  });
});
