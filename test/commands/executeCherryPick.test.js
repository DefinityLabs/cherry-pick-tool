const colors = require("colors");

const executeCherryPick = require("../../lib/commands/executeCherryPick");
const profile = require("../../lib/commands/commandsProfile");
const help = require("../../lib/commands/help");

const cherryPick = require("../../lib/cherryPick");
const emoji = require("../../lib/emoji");
const out = require("../../lib/output");

describe("executeCherryPick", () => {
  describe("can process", () => {
    it('returns true when press "x"', () => {
      expect(executeCherryPick.canProcess("x")).toBeTruthy();
    });
    it('returns false when press any key different of "x"', () => {
      expect(executeCherryPick.canProcess("z")).toBeFalsy();
    });
  });

  describe("help", () => {
    it('returns "x" as keys', () => {
      expect(executeCherryPick.help.keys).toEqual("x");
    });
    it('returns "Execute cherry pick" as description', () => {
      expect(executeCherryPick.help.description).toEqual("Execute cherry pick");
    });
  });

  describe("execute", () => {
    describe("when there are no commits in the cherrypick file", () => {
      let commits;

      beforeEach(() => {
        commits = [];

        emoji.get = jest.fn(name => name);
        out.println = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue(commits);
        profile.define = jest.fn();

        executeCherryPick.execute();
      });

      it("should return the commits from the cherrypick file", () => {
        expect(cherryPick.commits).toHaveBeenCalled();
      });

      it('should define "default" as profile', () => {
        expect(profile.define).toHaveBeenCalledWith("default");
      });
    });

    describe("when there are error executing cherrypick", () => {
      let commits;

      beforeEach(() => {
        commits = [
          {
            hash: "2c0abc97"
          }
        ];

        emoji.get = jest.fn(name => name);
        out.println = jest.fn();
        cherryPick.commits = jest.fn()
          .mockReturnValue(commits);
        cherryPick.executor = jest.fn()
          .mockReturnValue({apply: jest.fn((hash, cb) => cb('error'))});
        profile.define = jest.fn();
        help.execute = jest.fn();

        executeCherryPick.execute();
      });

      it("prints error message", () => {
        expect(out.println.mock.calls[0][0]).toEqual('thumbsdown');
        expect(out.println.mock.calls[0][1]).toEqual('  cannot cherry pick commit '.red
          + commits[0].hash.yellow);
      });

      it("prints question message", () => {
        expect(out.println.mock.calls[2][0]).toEqual('What would you like to do?');
      });

      it("prints help message", () => {
        expect(help.execute).toHaveBeenCalled();
      });
    });

    describe("when there is one commits in the cherrypick file", () => {
      let commits;

      beforeEach(() => {
        commits = [
          {
            hash: "2c0abc97"
          }
        ];

        emoji.get = jest.fn(name => name);
        out.println = jest.fn();
        cherryPick.commits = jest.fn().mockReturnValue(commits);
        cherryPick.executor = jest.fn().mockReturnValue({apply: jest.fn((hash, cb) => cb())});
        cherryPick.remove = jest.fn();
        profile.define = jest.fn();

        executeCherryPick.execute();
      });

      it("should return the commits from the cherrypick file", () => {
        expect(cherryPick.commits).toHaveBeenCalled();
      });

      it('should define "cherryPick" as profile', () => {
        expect(profile.define).toHaveBeenCalledWith("cherryPick");
      });

      it("prints message when cherry pick is done", () => {
        expect(out.println.mock.calls[0][0]).toEqual("thumbsup");
        expect(out.println.mock.calls[0][1]).toEqual(
          '  cherry pick done for commit '.cyan + commits[0].hash.yellow
        );
      });

      it("remove commit from cherrypick file", () => {
        expect(cherryPick.remove).toHaveBeenCalledWith(commits[0].hash);
      });

      it("prints message when cherry pick is done", () => {
        expect(out.println.mock.calls[2][0]).toEqual('sunglasses');
        expect(out.println.mock.calls[2][1]).toEqual('cherry pick was done'.green);
      });

      it('should define "default" as profile', () => {
        expect(profile.define).toHaveBeenCalledWith("default");
      });
    });
  });
});
