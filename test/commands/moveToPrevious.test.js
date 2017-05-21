const moveToPrevious = require('../../lib/commands/moveToPrevious');

const git = require('../../lib/git');
const printer = require('../../lib/printer');

describe('moveToPrevious', () => {
  describe('can process', () => {
    it('returns true when press "p" or "up"', () => {
      expect(moveToPrevious.canProcess('p')).toBeTruthy();
      expect(moveToPrevious.canProcess(undefined, { name: 'up' })).toBeTruthy();
    });
    it('returns false when press any key different of "n" and "up"', () => {
      expect(moveToPrevious.canProcess('x')).toBeFalsy();
      expect(moveToPrevious.canProcess(undefined, { name: 'down' })).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "n" or "up" as keys', () => {
      expect(moveToPrevious.help.keys).toEqual('<up> / p');
    });
    it('returns "Go to the previous commit" as description', () => {
      expect(moveToPrevious.help.description).toEqual('Go to the previous commit');
    });
  });

  describe('execute', () => {
    let commit, index;

    beforeEach(() => {
      commit = {};
      index = 1;

      git.previous = jest.fn(cb => cb(commit, index));
      printer.commit = jest.fn();

      moveToPrevious.execute();
    });

    it('calls git previous', () => {
      expect(git.previous).toHaveBeenCalled();
    });

    it('calls printer commit', () => {
      expect(printer.commit).toHaveBeenCalledWith(commit, index);
    });
  });
});
