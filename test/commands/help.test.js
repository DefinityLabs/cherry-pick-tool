const colors = require('colors');

const help = require('../../lib/commands/help');
const profile = require('../../lib/commands/commandsProfile');
const emoji = require('../../lib/emoji');
const out = require('../../lib/output');

describe('help', () => {
  describe('can process', () => {
    it('returns true when press "?" or "h"', () => {
      expect(help.canProcess('?')).toBeTruthy();
      expect(help.canProcess('h')).toBeTruthy();
    });
    it('returns false when press any key different of "?" or "h"', () => {
      expect(help.canProcess('x')).toBeFalsy();
    });
  });

  describe('help', () => {
    it('returns "? / h" as keys', () => {
      expect(help.help.keys).toEqual('? / h');
    });
    it('returns "Display a help message" as description', () => {
      expect(help.help.description).toEqual('Display a help message');
    });
  });

  describe('execute', () => {
    describe('when there is no current profile', () => {
      beforeEach(() => {
        emoji.get = jest.fn(name => name);
        out.println = jest.fn();
        profile.current = jest.fn().mockReturnValue(undefined);

        help.execute();
      });

      it('prints help message', () => {
        expect(out.println).toHaveBeenCalledWith('thinking_face', 'Commands:');
      });

      it('prints an empty line', () => {
        expect(out.println).toHaveBeenCalledWith();
      });
    });

    describe('when there is current profile', () => {
      describe('when there is no help', () => {
        let currentProfileCommands;

        beforeEach(() => {
          currentProfileCommands = [{}];

          emoji.get = jest.fn(name => name);
          out.println = jest.fn();
          profile.current = jest.fn().mockReturnValue({
            commands: jest.fn().mockReturnValue(currentProfileCommands)
          });

          help.execute();
        });

        it('prints help message', () => {
          expect(out.println).toHaveBeenCalledWith('thinking_face', 'Commands:');
        });

        it('prints an empty line', () => {
          expect(out.println).toHaveBeenCalledWith();
        });
      });

      describe('when there is help', () => {
        let currentProfileCommands;

        beforeEach(() => {
          currentProfileCommands = [
            {
              help: {
                keys: 't',
                description: 'this is the description'
              }
            }
          ];

          emoji.get = jest.fn(name => name);
          out.println = jest.fn();
          profile.current = jest.fn().mockReturnValue({
            commands: jest.fn().mockReturnValue(currentProfileCommands)
          });

          help.execute();
        });

        it('prints help message', () => {
          expect(out.println.mock.calls[0][0]).toEqual('thinking_face');
          expect(out.println.mock.calls[0][1]).toEqual('Commands:');
        });

        it('prints help message', () => {
          let text = '  ' + '           t'.yellow + '  this is the description';
          expect(out.println.mock.calls[1][0]).toEqual(text);
        });

        it('prints an empty line', () => {
          expect(out.println.mock.calls[2].length).toEqual(0);
        });
      });
    });
  });
});
