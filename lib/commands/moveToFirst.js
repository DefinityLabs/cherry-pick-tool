const git = require('../git');

module.exports = {
  canProcess: function(ch, key) {
    return ch === '0';
  },
  help: {
    keys: '0',
    description: 'Go to the first commit'
  },
  execute: function() {
    git.first(function(commit, index){
      git.printCommit(commit, index);
    });
  }
};
