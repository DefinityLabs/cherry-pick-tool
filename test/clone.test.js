const clone = require('../lib/clone');

describe('clone', () => {
  describe('when obj is undefined', () => {
    let cloned;

    beforeEach(() => {
      cloned = clone(undefined);
    });

    it('should return undefined', () => {
      expect(cloned).toBeUndefined();
    });
  });

  describe('when obj is not undefined', () => {
    let cloned;

    beforeEach(() => {
      cloned = clone({name: "John"});
    });

    it('should return undefined', () => {
      expect(cloned).toEqual({name: "John"});
    });
  });
});
