const colors = require('colors');

const abortCherryPick = require('../../lib/commands/abortCherryPick');

const profile = require('../../lib/commands/commandsProfile');
const cherryPick = require('../../lib/cherryPick');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('abortCherryPick', () => {
  describe('can process', () => {
    it('returns true when press "a"', () => {
      expect(abortCherryPick.canProcess('a')).toBeTruthy();
    });
    it('returns false when press any key different of "a"', () => {
      expect(abortCherryPick.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "a" as keys', () => {
      expect(abortCherryPick.help.keys).toEqual('a');
    });
    it('returns "Cancel the operation and return to the pre-sequence state" as description', () => {
      expect(abortCherryPick.help.description).toEqual('Cancel the operation and return to the pre-sequence state');
    });
  });

  describe('execute', () => {
    let executor;

    beforeEach(() => {
      emoji.get = jest.fn((name) => name);
      out.println = jest.fn();
      profile.define = jest.fn();
    });

    describe('when there is error', () => {
      beforeEach(() => {
        executor = {
          abort: jest.fn((cb) => cb('error'))
        };

        cherryPick.executor = jest.fn().mockReturnValue(executor);

        abortCherryPick.execute();
      });

      it('calls abort() function', () => {
        expect(executor.abort).toHaveBeenCalled();
      });

      it('does not print message', () => {
        expect(out.println.mock.calls.length).toEqual(0);
      });

      it('changes profile to default', () => {
        expect(profile.define).toHaveBeenCalledWith('default');
      });
    });

    describe('when there is no error', () => {
      beforeEach(() => {
        executor = {
          abort: jest.fn((cb) => cb())
        };

        cherryPick.executor = jest.fn().mockReturnValue(executor);

        abortCherryPick.execute();
      });

      it('calls abort() function', () => {
        expect(executor.abort).toHaveBeenCalled();
      });

      it('prints 2 messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints the succssful message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('worried');
        expect(out.println.mock.calls[0][1]).toEqual('cherry pick aborted'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });

      it('changes profile to default', () => {
        expect(profile.define).toHaveBeenCalledWith('default');
      });
    });
  });
});
