const quit = require('../../lib/commands/quit');

const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('quit', () => {
  describe('can process', () => {
    it('returns true when press "q"', () => {
      expect(quit.canProcess('q')).toBeTruthy();
    });
    it('returns false when press any key different of "q"', () => {
      expect(quit.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "q" as keys', () => {
      expect(quit.help.keys).toEqual('q');
    });
    it('returns "Exit the application" as description', () => {
      expect(quit.help.description).toEqual('Exit the application');
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      emoji.get = jest.fn(name => name);
      out.println = jest.fn();
      process.stdin.pause = jest.fn();

      quit.execute();
    });

    it('prints bye message', () => {
      expect(out.println).toHaveBeenCalledWith('wave', 'bye');
    });

    it('prints an empty line', () => {
      expect(out.println).toHaveBeenCalledWith();
    });

    it('calls stdin.pause()', () => {
      expect(process.stdin.pause).toHaveBeenCalled();
    });
  });
});
