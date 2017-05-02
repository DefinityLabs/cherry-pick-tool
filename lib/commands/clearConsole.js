const clear = require('clear');
const emoji = require('node-emoji');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'c';
  },
  help: {
    keys: 'c',
    description: 'Clear the console'
  },
  execute: function() {
    console.log(emoji.get('sleeping'));
    console.log('');
    clear();
  }
};
