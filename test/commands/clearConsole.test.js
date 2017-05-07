jest.mock('clear');

const clear = require('clear');

const clearConsole = require('../../lib/commands/clearConsole');

const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('clearConsole', () => {
  describe('can process', () => {
    it('returns true when press "c"', () => {
      expect(clearConsole.canProcess('c')).toBeTruthy();
    });
    it('returns false when press any key different of "c"', () => {
      expect(clearConsole.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "c" as keys', () => {
      expect(clearConsole.help.keys).toEqual('c');
    });
    it('returns "Clear the console" as description', () => {
      expect(clearConsole.help.description).toEqual('Clear the console');
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      emoji.get = jest.fn((name) => name);
      out.println = jest.fn();

      clearConsole.execute();
    });

    it('prints a marker', () => {
      expect(out.println).toHaveBeenCalledWith('sleeping');
    });

    it('prints an empty line', () => {
      expect(out.println).toHaveBeenCalledWith();
    });

    it('calls clear() function', () => {
      expect(clear).toHaveBeenCalled();
    });
  });
});
