const emoji = require('node-emoji');

const extra = require('./extra');

module.exports = {
  get: function(name) {
    if (extra.params().noEmoji) {
      return '';
    }
    return emoji.get(name) + ' ';
  }
};
