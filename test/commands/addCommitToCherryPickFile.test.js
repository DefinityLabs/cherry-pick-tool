const colors = require('colors');

const addCommitToCherryPickFile = require('../../lib/commands/addCommitToCherryPickFile');

const cherryPick = require('../../lib/cherryPick');
const git = require('../../lib/git');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('addCommitToCherryPickFile', () => {
  describe('can process', () => {
    it('returns true when press "a" or "+"', () => {
      expect(addCommitToCherryPickFile.canProcess('a')).toBeTruthy();
      expect(addCommitToCherryPickFile.canProcess('+')).toBeTruthy();
    });
    it('returns false when press any key different of "a" and "+"', () => {
      expect(addCommitToCherryPickFile.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "+ / a" as keys', () => {
      expect(addCommitToCherryPickFile.help.keys).toEqual('+ / a');
    });
    it('returns "Add the current commit to the cherry pick file" as description', () => {
      expect(addCommitToCherryPickFile.help.description).toEqual('Add the current commit to the cherry pick file');
    });
  });

  describe('execute', () => {
    let commit;

    beforeEach(() => {
      commit = {
        hash: '2a1c3b'
      };

      emoji.get = jest.fn((name) => name);
      out.println = jest.fn();
      cherryPick.add = jest.fn();
      git.commit = jest.fn().mockReturnValue(commit);
    });

    describe('when commit is already in the cherrypick file', () => {
      beforeEach(() => {
        cherryPick.has = jest.fn().mockReturnValue(true);

        addCommitToCherryPickFile.execute();
      });

      it('calls git.commit() function', () => {
        expect(git.commit).toHaveBeenCalled();
      });

      it('does not add commit to cherrypick file', () => {
        expect(cherryPick.add).not.toHaveBeenCalled();
      });

      it('does not print any message', () => {
        expect(out.println).not.toHaveBeenCalled();
      });
    });

    describe('when commit is not in the cherrypick file', () => {
      beforeEach(() => {
        cherryPick.has = jest.fn().mockReturnValue(false);

        addCommitToCherryPickFile.execute();
      });

      it('calls git.commit() function', () => {
        expect(git.commit).toHaveBeenCalled();
      });

      it('does not add commit to cherrypick file', () => {
        expect(cherryPick.add).toHaveBeenCalledWith(commit);
      });

      it('prints two messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints successful message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('cherries');
        expect(out.println.mock.calls[0][1]).toEqual('added to the cherry pick file'.green);
      });
    });
  });
});
