const colors = require('colors');
const moment = require('moment-timezone');

const cherryPick = require('../lib/cherryPick');
const emoji = require('../lib/emoji');
const out = require('../lib/output');
const printer = require('../lib/printer');

describe('printer', () => {
  let commit;

  beforeEach(() => {
    commit = {
      hash: '2ac79df',
      authorDate: '2017-01-01 10:00:00+01:00',
      authorName: 'David Sobreira Gouvea',
      authorEmail: 'david.sobreira.gouvea@gmail.com',
      authorDateRel: '2 days ago',
      subject: 'Refactor code',
      status: [
        'M',
        'D',
        'A',
        'X'
      ],
      files: [
        'index.js',
        'lib/removed.js',
        'lib/added.js',
        'lib/other.js'
      ]
    };

    out.println = jest.fn();
    emoji.get = jest.fn((name) => name);
  });

  describe('commit', () => {
    describe('without display position and files', () => {
      describe('when current timezone is the commit timezone', () => {
        beforeEach(() => {
          moment.tz.setDefault('CET');
        	printer.commit(commit, 0, false);
        });

        it('prints 6 lines', () => {
          expect(out.println.mock.calls.length).toEqual(6);
        });

        it('displays the commit hash', () => {
          expect(out.println.mock.calls[0][0])
            .toEqual(('commit ' + commit.hash).yellow);
          expect(out.println.mock.calls[0][1]).toEqual('');
          expect(out.println.mock.calls[0][2]).toEqual('');
        });

        it('displays the author information', () => {
          expect(out.println.mock.calls[1][0]).toEqual('Author: ');
          expect(out.println.mock.calls[1][1]).toEqual(commit.authorName);
          expect(out.println.mock.calls[1][2])
            .toEqual(' <' + commit.authorEmail + '>');
        });

        it('displays date information', () => {
          expect(out.println.mock.calls[2][0]).toEqual('Date:   ');
          expect(out.println.mock.calls[2][1])
            .toEqual('Sun Jan 01, 10:00:00AM');
          expect(out.println.mock.calls[2][2])
            .toEqual(' (' + commit.authorDateRel.magenta + ')');
        });

        it('displays an empty line', () => {
          expect(out.println.mock.calls[3][0]).toBeUndefined();
        });

        it('displays the subject', () => {
          expect(out.println.mock.calls[4][0]).toEqual('  ');
          expect(out.println.mock.calls[4][1]).toEqual(commit.subject);
        });

        it('displays an empty line', () => {
          expect(out.println.mock.calls[5][0]).toBeUndefined();
        });
      });

      describe('when current timezone is not the commit timezone', () => {
        describe('when the current time and commit time are different', () => {
          beforeEach(() => {
            moment.tz.setDefault('UTC');
          	printer.commit(commit, 0, false);
          });

          it('displays date information with original', () => {
            expect(out.println.mock.calls[2][0]).toEqual('Date:   ');
            expect(out.println.mock.calls[2][1])
              .toEqual('Sun Jan 01, 09:00:00AM'  + ' (10:00:00AM +01:00)'.gray);
            expect(out.println.mock.calls[2][2])
              .toEqual(' (' + commit.authorDateRel.magenta + ')');
          });
        });

        describe('when the current date and commit date are different', () => {
          beforeEach(() => {
            moment.tz.setDefault('Antarctica/McMurdo');

            commit.authorDate = '2017-01-01 18:00:00+01:00';

          	printer.commit(commit, 0, false);
          });

          it('displays date information with original', () => {
            expect(out.println.mock.calls[2][0]).toEqual('Date:   ');
            expect(out.println.mock.calls[2][1])
              .toEqual('Mon Jan 02, 06:00:00AM'
                + ' (Sun Jan 01, 06:00:00PM +01:00)'.gray);
            expect(out.println.mock.calls[2][2])
              .toEqual(' (' + commit.authorDateRel.magenta + ')');
          });
        });
      });
    });

    describe('display position', () => {
      beforeEach(() => {
        printer.commit(commit, 1);
      });

      it('displays the commit hash with position', () => {
        expect(out.println.mock.calls[0][0])
          .toEqual(('commit ' + commit.hash).yellow);
        expect(out.println.mock.calls[0][1]).toEqual('(' + '1'.cyan + ')');
        expect(out.println.mock.calls[0][2]).toEqual('');
      });
    });

    describe('display files', () => {
      beforeEach(() => {
        printer.commit(commit, 0, false, true);
      });

      it('displays the index file', () => {
        expect(out.println.mock.calls[6][0]).toEqual('  M index.js'.blue);
      });

      it('displays the removed file', () => {
        expect(out.println.mock.calls[7][0]).toEqual('  D lib/removed.js'.red);
      });

      it('displays the added file', () => {
        expect(out.println.mock.calls[8][0]).toEqual('  A lib/added.js'.green);
      });

      it('displays the other file', () => {
        expect(out.println.mock.calls[9][0]).toEqual('  X lib/other.js');
      });
    });

    describe('when commit is in the cherrypick file', () => {
      beforeEach(() => {
        cherryPick.has = jest.fn().mockReturnValue(true);
        printer.commit(commit, 0, false, false);
      });

      it('displays the commit hash with cherries', () => {
        expect(out.println.mock.calls[0][0])
          .toEqual(('commit ' + commit.hash).yellow);
        expect(out.println.mock.calls[0][1]).toEqual('');
        expect(out.println.mock.calls[0][2]).toEqual('cherries');
      });
    });
  });

  describe('files', () => {
    describe('display files', () => {
      beforeEach(() => {
        printer.files(commit);
      });

      it('displays the index file', () => {
        expect(out.println.mock.calls[0][0]).toEqual('  M index.js'.blue);
      });

      it('displays the removed file', () => {
        expect(out.println.mock.calls[1][0]).toEqual('  D lib/removed.js'.red);
      });

      it('displays the added file', () => {
        expect(out.println.mock.calls[2][0]).toEqual('  A lib/added.js'.green);
      });

      it('displays the other file', () => {
        expect(out.println.mock.calls[3][0]).toEqual('  X lib/other.js');
      });
    });
  });
});
