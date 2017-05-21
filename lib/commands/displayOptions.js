const extra = require('../extra');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'o';
  },
  help: {
    keys: 'o',
    description: 'Display the options'
  },
  execute: function() {
    out.println('Options:');

    let keys = Object.keys(extra.params());
    keys.forEach(function(key) {
      out.println('  ', key.magenta, '=', extra.params()[key]);
    });

    out.println();
  }
};
