const git = require('../git');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'p' || (key !== undefined && key.name === 'up');
  },
  help: {
    keys: '<up> / p',
    description: 'Go to the previous commit'
  },
  execute: function() {
    git.previous(function(commit, index){
      git.printCommit(commit, index);
    });
  }
};
