const displayOptions = require('../../lib/commands/displayOptions');

const extra = require('../../lib/extra');
const out = require('../../lib/output');

describe('displayOptions', () => {
  describe('can process', () => {
    it('returns true when press "o"', () => {
      expect(displayOptions.canProcess('o')).toBeTruthy();
    });
    it('returns false when press any key different of "o"', () => {
      expect(displayOptions.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "o" as keys', () => {
      expect(displayOptions.help.keys).toEqual('o');
    });
    it('returns "Display the options" as description', () => {
      expect(displayOptions.help.description).toEqual('Display the options');
    });
  });

  describe('execute', () => {
    let options;

    beforeEach(() => {
      options = {
        before: '2017-02-01',
        after: '2017-01-01'
      };

      extra.params = jest.fn().mockReturnValue(options);
      out.println = jest.fn();

      displayOptions.execute();
    });

    it('prints "Options"', () => {
      expect(out.println.mock.calls[0][0]).toEqual('Options:');
    });

    it('calls extra.params()', () => {
      expect(extra.params).toHaveBeenCalled();
    });

    it('prints params', () => {
      expect(out.println.mock.calls[1][0]).toEqual('  ');
      expect(out.println.mock.calls[1][1]).toEqual('before'.magenta);
      expect(out.println.mock.calls[1][2]).toEqual('=');
      expect(out.println.mock.calls[1][3]).toEqual('2017-02-01');

      expect(out.println.mock.calls[2][0]).toEqual('  ');
      expect(out.println.mock.calls[2][1]).toEqual('after'.magenta);
      expect(out.println.mock.calls[2][2]).toEqual('=');
      expect(out.println.mock.calls[2][3]).toEqual('2017-01-01');
    });

    it('prints an empty line', () => {
      expect(out.println.mock.calls[3][0]).toBeUndefined();
    });
  });
});
