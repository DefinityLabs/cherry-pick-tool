const emoji = require('../lib/emoji');
const extra = require('../lib/extra');

describe('emoji', () => {
  describe('when emoji is enabled', () => {
    beforeEach(() => {
      extra.params = jest.fn();
      extra.params.mockReturnValue({});
    });

    describe('get a smile emoji', () => {
      let smileEmoji;

      beforeEach(() => {
        smileEmoji = emoji.get('smile');
      });

      it('should return a emoji with space', () => {
        expect(smileEmoji).toEqual('😄 ');
      });
    });
  });

  describe('when emoji is not enabled', () => {
    beforeEach(() => {
      extra.params = jest.fn();
      extra.params.mockReturnValue({noEmoji: true});
    });

    describe('get a smile emoji', () => {
      let smileEmoji;

      beforeEach(() => {
        smileEmoji = emoji.get('smile');
      });

      it('should return an empty string', () => {
        expect(smileEmoji).toEqual('');
      });
    });
  });
});
