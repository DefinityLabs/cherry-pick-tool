const colors = require("colors");

const continueCherryPick = require("../../lib/commands/continueCherryPick");

const executeCherryPick = require("../../lib/commands/executeCherryPick");
const help = require("../../lib/commands/help");

const cherryPick = require("../../lib/cherryPick");
const emoji = require("../../lib/emoji");
const out = require("../../lib/output");

describe("continueCherryPick", () => {
  describe("can process", () => {
    it('returns true when press "c"', () => {
      expect(continueCherryPick.canProcess("c")).toBeTruthy();
    });
    it('returns false when press any key different of "c"', () => {
      expect(continueCherryPick.canProcess("x")).toBeFalsy();
    });
  });

  describe("help", () => {
    it('returns "c" as keys', () => {
      expect(continueCherryPick.help.keys).toEqual("c");
    });
    it('returns description as description', () => {
      expect(continueCherryPick.help.description).toEqual('Continue the operation in progress using the information in '
                 + '.git/sequencer. Can be used to continue after resolving '
                 + 'conflicts in a failed cherry-pick or revert');
    });
  });

  describe("execute", () => {
    let executor, commits;

    beforeEach(() => {
      commits = [
        {
          hash: '2c0abc97'
        }
      ];

      cherryPick.commits = jest.fn().mockReturnValue(commits);
    	emoji.get = jest.fn((name) => name);
    	out.println = jest.fn();
    	cherryPick.remove = jest.fn();
    	executeCherryPick.execute = jest.fn();
      help.execute = jest.fn();
    });

    describe("when there is an error", () => {
      beforeEach(() => {
        executor = {
          continue: jest.fn((cb) => cb('error'))
        };

        cherryPick.executor = jest.fn().mockReturnValue(executor);

        continueCherryPick.execute();
      });

      it("should return the commits from the cherrypick file", () => {
        expect(cherryPick.commits).toHaveBeenCalled();
      });

      it('does not remove commit from cherrypick file', () => {
        expect(cherryPick.remove).not.toHaveBeenCalled();
      });

      it('does not execute cherry pick', () => {
        expect(executeCherryPick.execute).not.toHaveBeenCalled();
      });

      it('prints error message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('thumbsdown');
        expect(out.println.mock.calls[0][1]).toEqual('cannot cherry pick commit '.red
          + commits[0].hash.yellow);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });

      it('prints "what would like to do?" message', () => {
        expect(out.println.mock.calls[2][0]).toEqual('What would you like to do?');
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[3][0]).toBeUndefined();
      });

      it('calls help command', () => {
        expect(help.execute).toHaveBeenCalled();
      });
    });

    describe("when is no error", () => {
      beforeEach(() => {
        executor = {
          continue: jest.fn((cb) => cb())
        };

        cherryPick.executor = jest.fn().mockReturnValue(executor);

        continueCherryPick.execute();
      });

      it("should return the commits from the cherrypick file", () => {
        expect(cherryPick.commits).toHaveBeenCalled();
      });

      it('removes commit from cherrypick file', () => {
        expect(cherryPick.remove).toHaveBeenCalledWith(commits[0].hash);
      });

      it('prints message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('thumbsup');
        expect(out.println.mock.calls[0][1]).toEqual('cherry pick done for commit '.cyan
          + commits[0].hash.yellow);
      });

      it('executes cherry pick', () => {
        expect(executeCherryPick.execute).toHaveBeenCalled();
      });
    });
  });
});
