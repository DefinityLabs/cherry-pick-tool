const git = require('../git');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'f';
  },
  help: {
    keys: 'f',
    description: 'Display the files affected by the current commit'
  },
  execute: function() {
    git.printFiles(git.commit());
  }
};
