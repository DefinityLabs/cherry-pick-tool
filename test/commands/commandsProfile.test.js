const profile = require('../../lib/commands/commandsProfile');

describe('profile', () => {
  describe('when there is no profile', () => {
    describe('current profile', () => {
      it('should be undefined', () => {
        expect(profile.current()).toBeUndefined();
      });
    });
  });

  describe('create "default" profile', () => {
    let defaultProfile;

    beforeAll(() => {
      defaultProfile = profile.get('default');
    });

    it('returns the commands object', () => {
      expect(defaultProfile.get).not.toBeUndefined();
      expect(defaultProfile.add).not.toBeUndefined();
      expect(defaultProfile.forEach).not.toBeUndefined();
    });

    it('should not create a new instance for the same profile', () => {
      expect(profile.get('default')).toBe(defaultProfile);
    });

    describe('define "default" as current profile', () => {
      beforeEach(() => {
        profile.define('default');
      });

      it('should be "default"', () => {
        expect(profile.current()).toEqual(defaultProfile);
      });
    });

    afterAll(() => {
      profile.remove('default');
    });
  });
});
