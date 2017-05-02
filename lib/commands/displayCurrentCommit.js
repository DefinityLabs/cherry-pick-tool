const git = require('../git');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'i';
  },
  help: {
    keys: 'i',
    description: 'Display the current commit'
  },
  execute: function() {
    git.printCommit(git.commit(), git.index());
  }
};
