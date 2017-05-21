const moveToFirst = require('../../lib/commands/moveToFirst');

const git = require('../../lib/git');
const printer = require('../../lib/printer');

describe('moveToFirst', () => {
  describe('can process', () => {
    it('returns true when press "0"', () => {
      expect(moveToFirst.canProcess('0')).toBeTruthy();
    });
    it('returns false when press any key different of "0"', () => {
      expect(moveToFirst.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "0" as keys', () => {
      expect(moveToFirst.help.keys).toEqual('0');
    });
    it('returns "Go to the first commit" as description', () => {
      expect(moveToFirst.help.description).toEqual('Go to the first commit');
    });
  });

  describe('execute', () => {
    let commit, index;

    beforeEach(() => {
      commit = {};
      index = 1;

      git.first = jest.fn(cb => cb(commit, index));
      printer.commit = jest.fn();

      moveToFirst.execute();
    });

    it('calls git first', () => {
      expect(git.first).toHaveBeenCalled();
    });

    it('calls printer commit', () => {
      expect(printer.commit).toHaveBeenCalledWith(commit, index);
    });
  });
});
