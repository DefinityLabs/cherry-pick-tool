const appendEmptyLineInConsole = require('../../lib/commands/appendEmptyLineInConsole');

const out = require('../../lib/output');

describe('appendEmptyLineInConsole', () => {
  describe('can process', () => {
    it('returns true when press "return" or "enter"', () => {
      expect(appendEmptyLineInConsole.canProcess(undefined, {name: 'return'})).toBeTruthy();
      expect(appendEmptyLineInConsole.canProcess(undefined, {name: 'enter'})).toBeTruthy();
    });
    it('returns false when press any key different of "return" or "enter"', () => {
      expect(appendEmptyLineInConsole.canProcess(undefined, {name: 'down'})).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "enter" as keys', () => {
      expect(appendEmptyLineInConsole.help.keys).toEqual('<enter>');
    });
    it('returns "Append an empty line in the console" as description', () => {
      expect(appendEmptyLineInConsole.help.description).toEqual('Append an empty line in the console');
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      out.println = jest.fn();

      appendEmptyLineInConsole.execute();
    });

    it('prints an empty line', () => {
      expect(out.println).toHaveBeenCalled();;
    });
  });
});
