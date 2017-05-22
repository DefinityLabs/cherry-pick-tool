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

    it('returns the profile object', () => {
      expect(defaultProfile.commands).not.toBeUndefined();
      expect(defaultProfile.setRawMode).not.toBeUndefined();
      expect(defaultProfile.getRawMode).not.toBeUndefined();
    });

    it('returns the commands object', () => {
      expect(defaultProfile.commands().get).not.toBeUndefined();
      expect(defaultProfile.commands().add).not.toBeUndefined();
      expect(defaultProfile.commands().forEach).not.toBeUndefined();
    });

    it('should not create a new instance for the same profile', () => {
      expect(profile.get('default')).toBe(defaultProfile);
    });

    describe('when rawMode is true', () => {
      it('returns false', () => {
        expect(defaultProfile.getRawMode()).toBeFalsy();
      });
    });

    describe('when rawMode is true', () => {
      let setRawMode;

      describe('when stdin isTTY is true', () => {
        beforeEach(() => {
          setRawMode = jest.fn();

          Object.defineProperty(process, 'stdin', {
    				value: {
              isTTY: true,
              setRawMode: setRawMode
            },
    				configurable: true,
    				writable: false
    			});

        	defaultProfile.setRawMode(true);

          profile.define('default');
        });

        it('calls setRawMode', () => {
          expect(process.stdin.setRawMode).toHaveBeenCalledWith(true);
        });

        it('returns true', () => {
          expect(defaultProfile.getRawMode).toBeTruthy();
        });
      });

      describe('when stdin isTTY is false', () => {
        beforeEach(() => {
          setRawMode = jest.fn();

          Object.defineProperty(process, 'stdin', {
    				value: {
              isTTY: false,
              setRawMode: setRawMode
            },
    				configurable: true,
    				writable: false
    			});

        	defaultProfile.setRawMode(true);

          profile.define('default');
        });

        it('does not call setRawMode', () => {
          expect(process.stdin.setRawMode).not.toHaveBeenCalled();
        });
      });
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
