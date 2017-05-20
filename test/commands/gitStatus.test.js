const gitStatus = require('../../lib/commands/gitStatus');

const cherryPick = require('../../lib/cherryPick');

describe('gitStatus', () => {
  describe('can process', () => {
    it('returns true when press "s"', () => {
      expect(gitStatus.canProcess('s')).toBeTruthy();
    });
    it('returns false when press any key different of "s"', () => {
      expect(gitStatus.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "s" as keys', () => {
      expect(gitStatus.help.keys).toEqual('s');
    });
    it('returns "git status" as description', () => {
      expect(gitStatus.help.description).toEqual('git status');
    });
  });

  describe('execute', () => {
    let executor;

    beforeEach(() => {
      executor = {
        status: jest.fn()
      };

      cherryPick.executor = jest.fn().mockReturnValue(executor);

      gitStatus.execute();
    });

    it('calls cherryPick.executor().status()', () => {
      expect(executor.status).toHaveBeenCalled();
    });
  });
});
