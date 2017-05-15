const moveToNext = require('../../lib/commands/moveToNext');

const git = require('../../lib/git');
const printer = require('../../lib/printer');

describe('moveToNext', () => {
  describe('can process', () => {
    it('returns true when press "n" or "down"', () => {
      expect(moveToNext.canProcess('n')).toBeTruthy();
      expect(moveToNext.canProcess(undefined, {name: 'down'})).toBeTruthy();
    });
    it('returns false when press any key different of "n" and "down"', () => {
      expect(moveToNext.canProcess('x')).toBeFalsy();
      expect(moveToNext.canProcess(undefined, {name: 'up'})).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "n" or "down" as keys', () => {
      expect(moveToNext.help.keys).toEqual('<down> / n');
    });
    it('returns "Go to the next commit" as description', () => {
      expect(moveToNext.help.description).toEqual('Go to the next commit');
    });
  });

  describe('execute', () => {
    let commit, index;

    beforeEach(() => {
      commit = {};
      index = 1;

      git.next = jest.fn((cb) => cb(commit, index));
      printer.commit = jest.fn();

      moveToNext.execute();
    });

    it('calls git next', () => {
      expect(git.next).toHaveBeenCalled();;
    });

    it('calls printer commit', () => {
      expect(printer.commit).toHaveBeenCalledWith(commit, index);
    });
  });
});
