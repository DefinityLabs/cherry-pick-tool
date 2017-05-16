const writeCherryPickFile = require('../../lib/commands/writeCherryPickFile');

const cherryPick = require('../../lib/cherryPick');

describe('writeCherryPickFile', () => {
  describe('can process', () => {
    it('returns true when press "w"', () => {
      expect(writeCherryPickFile.canProcess('w')).toBeTruthy();
    });
    it('returns false when press any key different of "w"', () => {
      expect(writeCherryPickFile.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "w" as keys', () => {
      expect(writeCherryPickFile.help.keys).toEqual('w');
    });
    it('returns "Save the cherry pick file as .cherrypick" as description', () => {
      expect(writeCherryPickFile.help.description).toEqual('Save the cherry pick file as .cherrypick');
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      cherryPick.writeFile = jest.fn();

      writeCherryPickFile.execute();
    });

    it('calls cherryPick.writeFile', () => {
      expect(cherryPick.writeFile).toHaveBeenCalled();;
    });
  });
});
