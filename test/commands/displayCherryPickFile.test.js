const displayCherryPickFile = require('../../lib/commands/displayCherryPickFile');

const cherryPick = require('../../lib/cherryPick');
const git = require('../../lib/git');
const out = require('../../lib/output');
const printer = require('../../lib/printer');

describe('displayCherryPickFile', () => {
  describe('can process', () => {
    it('returns true when press "v"', () => {
      expect(displayCherryPickFile.canProcess('v')).toBeTruthy();
    });
    it('returns false when press any key different of "v"', () => {
      expect(displayCherryPickFile.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "v" as keys', () => {
      expect(displayCherryPickFile.help.keys).toEqual('v');
    });
    it('returns "Display the content of the cherry pick file" as description', () => {
      expect(displayCherryPickFile.help.description).toEqual(
        'Display the content of the cherry pick file'
      );
    });
  });

  describe('execute', () => {
    let commits;

    beforeEach(() => {
      out.println = jest.fn();
      printer.commit = jest.fn();
    });

    describe('when file is empty', () => {
      beforeEach(() => {
        commits = [];

        cherryPick.commits = jest.fn().mockReturnValue(commits);

        displayCherryPickFile.execute();
      });

      it('prints the begining of the file', () => {
        expect(out.println.mock.calls[0][0]).toEqual(
          '============ BEGIN OF CHERRY PICK FILE ============'.cyan
        );
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });

      it('prints message "File is empty"', () => {
        expect(out.println.mock.calls[2][0]).toEqual('File is empty');
        expect(out.println.mock.calls[3][0]).toBeUndefined();
      });

      it('prints the ending of the file', () => {
        expect(out.println.mock.calls[4][0]).toEqual(
          '============= END OF CHERRY PICK FILE ============='.cyan
        );
        expect(out.println.mock.calls[5][0]).toBeUndefined();
      });
    });

    describe('when file is not empty', () => {
      beforeEach(() => {
        commits = [{}, {}];

        cherryPick.commits = jest.fn().mockReturnValue(commits);

        displayCherryPickFile.execute();
      });

      it('prints the begining of the file', () => {
        expect(out.println.mock.calls[0][0]).toEqual(
          '============ BEGIN OF CHERRY PICK FILE ============'.cyan
        );
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });

      it('does not print message "File is empty"', () => {
        expect(out.println.mock.calls[2][0]).not.toEqual('File is empty');
      });

      it('calls printer.commit for each commit', () => {
        expect(printer.commit.mock.calls.length).toEqual(2);
        expect(printer.commit.mock.calls[0][0]).toEqual(commits[0]);
        expect(printer.commit.mock.calls[0][1]).toEqual(-1);
        expect(printer.commit.mock.calls[0][2]).toEqual(false);
        expect(printer.commit.mock.calls[0][3]).toEqual(true);

        expect(printer.commit.mock.calls[1][0]).toEqual(commits[1]);
        expect(printer.commit.mock.calls[1][1]).toEqual(-1);
        expect(printer.commit.mock.calls[1][2]).toEqual(false);
        expect(printer.commit.mock.calls[1][3]).toEqual(true);
      });

      it('prints the ending of the file', () => {
        expect(out.println.mock.calls[2][0]).toEqual(
          '============= END OF CHERRY PICK FILE ============='.cyan
        );
        expect(out.println.mock.calls[3][0]).toBeUndefined();
      });
    });
  });
});
