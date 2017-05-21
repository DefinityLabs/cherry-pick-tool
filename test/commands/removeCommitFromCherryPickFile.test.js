const removeCommitFromCherryPickFile = require('../../lib/commands/removeCommitFromCherryPickFile');

const cherryPick = require('../../lib/cherryPick');
const emoji = require('../../lib/emoji');
const git = require('../../lib/git');
const out = require('../../lib/output');

describe('removeCommitFromCherryPickFile', () => {
  describe('can process', () => {
    it('returns true when press "- / r"', () => {
      expect(removeCommitFromCherryPickFile.canProcess('-')).toBeTruthy();
      expect(removeCommitFromCherryPickFile.canProcess('r')).toBeTruthy();
    });
    it('returns false when press any key different of "w"', () => {
      expect(removeCommitFromCherryPickFile.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "- / r" as keys', () => {
      expect(removeCommitFromCherryPickFile.help.keys).toEqual('- / r');
    });
    it('returns "Remove the current commit from the cherry pick file" as description', () => {
      expect(removeCommitFromCherryPickFile.help.description).toEqual(
        'Remove the current commit from the cherry pick file'
      );
    });
  });

  describe('execute', () => {
    let commit;

    beforeEach(() => {
      commit = {
        hash: '2ac19c7b'
      };

      emoji.get = jest.fn(name => name);
      out.println = jest.fn();
      git.commit = jest.fn().mockReturnValue(commit);
      cherryPick.remove = jest.fn();
    });

    describe('when commit is not on the cherrypick file', () => {
      beforeEach(() => {
        cherryPick.has = jest.fn().mockReturnValue(false);

        removeCommitFromCherryPickFile.execute();
      });

      it('not calls cherryPick.remove', () => {
        expect(cherryPick.remove).not.toHaveBeenCalled();
      });

      it('not prints any message', () => {
        expect(out.println).not.toHaveBeenCalled();
      });
    });

    describe('when commit is on the cherrypick file', () => {
      beforeEach(() => {
        cherryPick.has = jest.fn().mockReturnValue(true);

        removeCommitFromCherryPickFile.execute();
      });

      it('calls cherryPick.remove', () => {
        expect(cherryPick.remove).toHaveBeenCalledWith(commit.hash);
      });

      it('prints any message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('knife');
        expect(out.println.mock.calls[0][1]).toEqual('removed from cherry pick file'.red);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[(1)[0]]).toBeUndefined();
      });
    });
  });
});
