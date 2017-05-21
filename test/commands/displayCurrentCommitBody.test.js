const displayCurrentCommitBody = require('../../lib/commands/displayCurrentCommitBody');

const git = require('../../lib/git');
const out = require('../../lib/output');

describe('displayCurrentCommitBody', () => {
  describe('can process', () => {
    it('returns true when press "b"', () => {
      expect(displayCurrentCommitBody.canProcess('b')).toBeTruthy();
    });
    it('returns false when press any key different of "b"', () => {
      expect(displayCurrentCommitBody.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "b" as keys', () => {
      expect(displayCurrentCommitBody.help.keys).toEqual('b');
    });
    it('returns "Display the body of the current commit" as description', () => {
      expect(displayCurrentCommitBody.help.description).toEqual('Display the body of the current commit');
    });
  });

  describe('execute', () => {
    let commit;

    beforeEach(() => {
      commit = {
        body: 'This is the body of the commit\n\n- first line\n- second line'
      };

      git.commit = jest.fn().mockReturnValue(commit);
      out.println = jest.fn();

      displayCurrentCommitBody.execute();
    });

    it('calls git.commit', () => {
      expect(git.commit).toHaveBeenCalled();
    });

    it('prints the commit body', () => {
      expect(out.println).toHaveBeenCalledWith('  ', 'This is the body of the commit\n  \n  - first line\n  - second line');
    });
  });
});
