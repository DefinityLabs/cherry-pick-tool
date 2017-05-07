const clear = require('clear');

const emoji = require('../emoji');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'c';
  },
  help: {
    keys: 'c',
    description: 'Clear the console'
  },
  execute: function() {
    out.println(emoji.get('sleeping'));
    out.println();
    clear();
  }
};
