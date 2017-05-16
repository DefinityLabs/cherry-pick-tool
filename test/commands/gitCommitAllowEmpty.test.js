const gitCommitAllowEmpty = require('../../lib/commands/gitCommitAllowEmpty');

const git = require('../../lib/git');
const printer = require('../../lib/printer');

const executeCherryPick = require('../../lib/commands/executeCherryPick');
const cherryPick = require('../../lib/cherryPick');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('gitCommitAllowEmpty', () => {
  describe('can process', () => {
    it('returns true when press "e"', () => {
      expect(gitCommitAllowEmpty.canProcess('e')).toBeTruthy();
    });
    it('returns false when press any key different of "e"', () => {
      expect(gitCommitAllowEmpty.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "e" as keys', () => {
      expect(gitCommitAllowEmpty.help.keys).toEqual('e');
    });
    it('returns "git commit --allow-empty" as description', () => {
      expect(gitCommitAllowEmpty.help.description).toEqual('git commit --allow-empty');
    });
  });

  describe('execute', () => {
    let commit;

    beforeEach(() => {
      commit = {
        hash: '1a2c23e'
      };

      emoji.get = jest.fn((name) => name);
      out.println = jest.fn();
    });

    describe('when there are error to commit', () => {
      beforeEach(() => {
        cherryPick.remove = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue([commit]);
        cherryPick.executor = jest.fn().mockReturnValue({
          commitAllowEmpty: jest.fn((msg, cb) => cb('error'))
        });

        executeCherryPick.execute = jest.fn();

        gitCommitAllowEmpty.execute();
      });

      it('calls cherryPick.commits', () => {
        expect(cherryPick.commits).toHaveBeenCalled();
      });

      it('not calls cherryPick.remove', () => {
        expect(cherryPick.remove).not.toHaveBeenCalled();;
      });

      it('not prints any message', () => {
        expect(out.println).not.toHaveBeenCalled();
      });

      it('not calls executeCherryPick', () => {
        expect(executeCherryPick.execute).not.toHaveBeenCalled();
      });
    });

    describe('when there is no error', () => {
      beforeEach(() => {
        cherryPick.remove = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue([commit]);
        cherryPick.executor = jest.fn().mockReturnValue({
          commitAllowEmpty: jest.fn((msg, cb) => cb())
        });

        executeCherryPick.execute = jest.fn();

        gitCommitAllowEmpty.execute();
      });

      it('calls cherryPick.commits', () => {
        expect(cherryPick.commits).toHaveBeenCalled();
      });

      it('calls cherryPick.remove', () => {
        expect(cherryPick.remove).toHaveBeenCalledWith(commit.hash);
      });

      it('prints commit done message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('no_mouth');
        expect(out.println.mock.calls[0][1]).toEqual('commit done'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });

      it('calls executeCherryPick', () => {
        expect(executeCherryPick.execute).toHaveBeenCalled();
      });
    });
  });
});
