const displayCurrentCommitFiles = require('../../lib/commands/displayCurrentCommitFiles');

const git = require('../../lib/git');
const printer = require('../../lib/printer');

describe('displayCurrentCommitFiles', () => {
  describe('can process', () => {
    it('returns true when press "f"', () => {
      expect(displayCurrentCommitFiles.canProcess('f')).toBeTruthy();
    });
    it('returns false when press any key different of "f"', () => {
      expect(displayCurrentCommitFiles.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "f" as keys', () => {
      expect(displayCurrentCommitFiles.help.keys).toEqual('f');
    });
    it('returns "Display the files affected by the current commit" as description', () => {
      expect(displayCurrentCommitFiles.help.description).toEqual(
        'Display the files affected by the current commit'
      );
    });
  });

  describe('execute', () => {
    let commit;

    beforeEach(() => {
      commit = {};

      git.commit = jest.fn().mockReturnValue(commit);
      printer.files = jest.fn();

      displayCurrentCommitFiles.execute();
    });

    it('calls git.commit', () => {
      expect(git.commit).toHaveBeenCalled();
    });

    it('calls printer.files', () => {
      expect(printer.files).toHaveBeenCalledWith(commit);
    });
  });
});
