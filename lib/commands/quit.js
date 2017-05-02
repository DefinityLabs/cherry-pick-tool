const emoji = require('node-emoji');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'q';
  },
  help: {
    keys: 'q',
    description: 'Exit the application'
  },
  execute: function() {
    console.log(emoji.get('wave') + '  bye');
    console.log('');
    process.stdin.pause();
  }
};
