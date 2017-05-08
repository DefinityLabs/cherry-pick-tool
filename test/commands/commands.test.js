const commands = require('../../lib/commands/commands');

describe('commands', () => {
  describe('add commands', () => {
    let _commands, commandA, commandB;

    beforeEach(() => {
      commandA = {};
      commandB = {};

      _commands = new commands();
      _commands.add(commandA);
      _commands.add(commandB);
    });

    it('returns length 2', () => {
      expect(_commands.get().length).toEqual(2);
    });

    it('returns commandA as first command', () => {
      expect(_commands.get()[0]).toBe(commandA);
    });

    it('returns commandB as second command', () => {
      expect(_commands.get()[1]).toBe(commandB);
    });

    it('should iterate over 2 commands', () => {
      let index = 0;
      _commands.forEach(() => index++);

      expect(index).toEqual(2);
    });
  });
});
