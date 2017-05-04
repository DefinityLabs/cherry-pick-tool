const git = require('../git');
const printer = require('../printer');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'i';
  },
  help: {
    keys: 'i',
    description: 'Display the current commit'
  },
  execute: function() {
    printer.commit(git.commit(), git.index());
  }
};
