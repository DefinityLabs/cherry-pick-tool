const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return key !== undefined && (key.name === 'return' || key.name === 'enter');
  },
  help: {
    keys: '<enter>',
    description: 'Append an empty line in the console'
  },
  execute: function() {
    out.println();
  }
};
