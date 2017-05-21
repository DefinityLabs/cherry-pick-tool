const displayCurrentCommit = require('../../lib/commands/displayCurrentCommit');

const git = require('../../lib/git');
const printer = require('../../lib/printer');

describe('displayCurrentCommit', () => {
  describe('can process', () => {
    it('returns true when press "i"', () => {
      expect(displayCurrentCommit.canProcess('i')).toBeTruthy();
    });
    it('returns false when press any key different of "i"', () => {
      expect(displayCurrentCommit.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "i" as keys', () => {
      expect(displayCurrentCommit.help.keys).toEqual('i');
    });
    it('returns "Display the current commit" as description', () => {
      expect(displayCurrentCommit.help.description).toEqual('Display the current commit');
    });
  });

  describe('execute', () => {
    let commit, index;

    beforeEach(() => {
      commit = {};
      index = 2;

      git.commit = jest.fn().mockReturnValue(commit);
      git.index = jest.fn().mockReturnValue(index);
      printer.commit = jest.fn();

      displayCurrentCommit.execute();
    });

    it('calls git.commit', () => {
      expect(git.commit).toHaveBeenCalled();
    });

    it('calls git.index', () => {
      expect(git.index).toHaveBeenCalled();
    });

    it('calls printer.commit', () => {
      expect(printer.commit).toHaveBeenCalledWith(commit, index);
    });
  });
});
