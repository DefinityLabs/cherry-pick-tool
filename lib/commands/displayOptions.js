const extra = require('../extra');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'o';
  },
  help: {
    keys: 'o',
    description: 'Display the options'
  },
  execute: function() {
    console.log('Options:');

    let keys = Object.keys(extra.params());
    keys.forEach(function(key){
      console.log('  ', key.magenta, '=', extra.params()[key]);
    });

    console.log('');
  }
};
