const emoji = require('../emoji');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'q';
  },
  help: {
    keys: 'q',
    description: 'Exit the application'
  },
  execute: function() {
    out.println(emoji.get('wave'), 'bye');
    out.println();
    process.stdin.pause();
  }
};
