const colors = require('colors');

const clearCherryPickFile = require('../../lib/commands/clearCherryPickFile');

const cherryPick = require('../../lib/cherryPick');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('clearCherryPickFile', () => {
  describe('can process', () => {
    it('returns true when press "#"', () => {
      expect(clearCherryPickFile.canProcess('#')).toBeTruthy();
    });
    it('returns false when press any key different of "#"', () => {
      expect(clearCherryPickFile.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "#" as keys', () => {
      expect(clearCherryPickFile.help.keys).toEqual('#');
    });
    it('returns "Clear cherry pick file" as description', () => {
      expect(clearCherryPickFile.help.description).toEqual('Clear cherry pick file '
        + 'it doesn\'t save the file'.underline);
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      emoji.get = jest.fn((name) => name);
      out.println = jest.fn();
      cherryPick.clear = jest.fn();

      clearCherryPickFile.execute();
    });

    it('calls clear() function', () => {
      expect(cherryPick.clear).toHaveBeenCalled();
    });

    it('prints the succssful message', () => {
      expect(out.println).toHaveBeenCalledWith('wastebasket', 'cherry pick file is empty'.cyan);
    });

    it('prints an empty line', () => {
      expect(out.println).toHaveBeenCalledWith();
    });
  });
});
