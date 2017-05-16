const loadCherryPickFile = require('../../lib/commands/loadCherryPickFile');

const cherryPick = require('../../lib/cherryPick');

describe('loadCherryPickFile', () => {
  describe('can process', () => {
    it('returns true when press "L"', () => {
      expect(loadCherryPickFile.canProcess('L')).toBeTruthy();
    });
    it('returns false when press any key different of "L"', () => {
      expect(loadCherryPickFile.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "L" as keys', () => {
      expect(loadCherryPickFile.help.keys).toEqual('L');
    });
    it('returns "Load .cherrypick file if exists" as description', () => {
      expect(loadCherryPickFile.help.description).toEqual('Load .cherrypick file if exists');
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      cherryPick.load = jest.fn();

      loadCherryPickFile.execute();
    });

    it('calls cherryPick load', () => {
      expect(cherryPick.load).toHaveBeenCalled();;
    });
  });
});
