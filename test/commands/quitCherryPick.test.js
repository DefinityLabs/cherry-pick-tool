const colors = require('colors');

const quitCherryPick = require('../../lib/commands/quitCherryPick');

const profile = require('../../lib/commands/commandsProfile');
const cherryPick = require('../../lib/cherryPick');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('quitCherryPick', () => {
  describe('can process', () => {
    it('returns true when press "q"', () => {
      expect(quitCherryPick.canProcess('q')).toBeTruthy();
    });
    it('returns false when press any key different of "q"', () => {
      expect(quitCherryPick.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "q" as keys', () => {
      expect(quitCherryPick.help.keys).toEqual('q');
    });
    it('returns the description as description', () => {
      expect(quitCherryPick.help.description).toEqual(
        'Forget about the current operation in progress. ' +
          'Can be used to clear the sequencer state after a failed ' +
          'cherry-pick or revert'
      );
    });
  });

  describe('execute', () => {
    let executor, commits;

    beforeEach(() => {
      emoji.get = jest.fn(name => name);
      out.println = jest.fn();
      cherryPick.remove = jest.fn();
      profile.define = jest.fn();
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        executor = {
          quit: jest.fn(cb => cb('error'))
        };

        cherryPick.executor = jest.fn().mockReturnValue(executor);

        quitCherryPick.execute();
      });

      it('does not call cherryPick.remove', () => {
        expect(cherryPick.remove).not.toHaveBeenCalled();
      });

      it('does not print any message', () => {
        expect(out.println).not.toHaveBeenCalled();
      });

      it('defines the profile as "default"', () => {
        expect(profile.define).toHaveBeenCalledWith('default');
      });
    });

    describe('when there is no error', () => {
      describe('there are no commits', () => {
        beforeEach(() => {
          executor = {
            quit: jest.fn(cb => cb())
          };

          commits = [];

          cherryPick.commits = jest.fn().mockReturnValue(commits);
          cherryPick.executor = jest.fn().mockReturnValue(executor);

          quitCherryPick.execute();
        });

        it('does not call cherryPick.remove', () => {
          expect(cherryPick.remove).not.toHaveBeenCalled();
        });

        it('does not print any message', () => {
          expect(out.println).not.toHaveBeenCalled();
        });

        it('defines the profile as "default"', () => {
          expect(profile.define).toHaveBeenCalledWith('default');
        });
      });

      describe('there are commits', () => {
        beforeEach(() => {
          executor = {
            quit: jest.fn(cb => cb())
          };

          commits = [
            {
              hash: '2a31b5c'
            }
          ];

          cherryPick.commits = jest.fn().mockReturnValue(commits);
          cherryPick.executor = jest.fn().mockReturnValue(executor);

          quitCherryPick.execute();
        });

        it('calls cherryPick.remove', () => {
          expect(cherryPick.remove).toHaveBeenCalledWith(commits[0].hash);
        });

        it('prints quit message', () => {
          expect(out.println.mock.calls[0][0]).toEqual('hushed');
          expect(out.println.mock.calls[0][1]).toEqual('cherry pick quit'.cyan);
        });

        it('prints an empty line', () => {
          expect(out.println.mock.calls[1][0]).toBeUndefined();
        });

        it('defines the profile as "default"', () => {
          expect(profile.define).toHaveBeenCalledWith('default');
        });
      });
    });
  });
});
