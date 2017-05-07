const colors = require('colors');

const gitReset = require('../../lib/commands/gitReset');
const executeCherryPick = require('../../lib/commands/executeCherryPick');
const cherryPick = require('../../lib/cherryPick');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('gitReset', () => {
  describe('can process', () => {
    it('returns true when press "r"', () => {
      expect(gitReset.canProcess('r')).toBeTruthy();
    });
    it('returns false when press any key different of "r"', () => {
      expect(gitReset.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "r" as keys', () => {
      expect(gitReset.help.keys).toEqual('r');
    });
    it('returns "git reset" as description', () => {
      expect(gitReset.help.description).toEqual('git reset');
    });
  });

  describe('execute', () => {
    describe('when there is error', () => {
      beforeEach(() => {
        emoji.get = jest.fn((name) => name);
        out.println = jest.fn();
        executeCherryPick.execute = jest.fn();
        cherryPick.remove = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue([]);
        cherryPick.executor = jest.fn().mockReturnValue({reset: jest.fn((cb) => cb('error'))});

        gitReset.execute();
      });

      it('should not call commits', () => {
        expect(cherryPick.commits).not.toHaveBeenCalled();
      });

      it('should not call remove', () => {
        expect(cherryPick.remove).not.toHaveBeenCalled();
      });

      it('prints "reset done" message', () => {
        expect(out.println).not.toHaveBeenCalled();
      });

      it('should not call executeCherryPick.execute()', () => {
        expect(executeCherryPick.execute).not.toHaveBeenCalled();
      });
    });

    describe('when there are no commits', () => {
      beforeEach(() => {
        emoji.get = jest.fn((name) => name);
        out.println = jest.fn();
        executeCherryPick.execute = jest.fn();
        cherryPick.remove = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue([]);
        cherryPick.executor = jest.fn().mockReturnValue({reset: jest.fn((cb) => cb())});

        gitReset.execute();
      });

      it('remove should not be called', () => {
        expect(cherryPick.remove).not.toHaveBeenCalled();
      });

      it('prints "reset done" message', () => {
        expect(out.println).toHaveBeenCalledWith('hushed', 'reset done'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println).toHaveBeenCalledWith();
      });

      it('calls executeCherryPick.execute()', () => {
        expect(executeCherryPick.execute).toHaveBeenCalled();
      });
    });

    describe('when there are commits', () => {
      let commits;

      beforeEach(() => {
        commits = [
          {hash: '20a58c7b'}
        ];

        emoji.get = jest.fn((name) => name);
        out.println = jest.fn();
        executeCherryPick.execute = jest.fn();
        cherryPick.remove = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue(commits);
        cherryPick.executor = jest.fn().mockReturnValue({reset: jest.fn((cb) => cb())});

        gitReset.execute();
      });

      it('remove should be called', () => {
        expect(cherryPick.remove).toHaveBeenCalledWith(commits[0].hash);
      });

      it('prints "reset done" message', () => {
        expect(out.println).toHaveBeenCalledWith('hushed', 'reset done'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println).toHaveBeenCalledWith();
      });

      it('calls executeCherryPick.execute()', () => {
        expect(executeCherryPick.execute).toHaveBeenCalled();
      });
    });
  });
});
