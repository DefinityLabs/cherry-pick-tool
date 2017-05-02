const git = require('../git');
const clone = require('../clone');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'n' || (key !== undefined && key.name === 'down');
  },
  help: {
    keys: '<down> / n',
    description: 'Go to the next commit'
  },
  execute: function() {
    git.next(function(commit, index){
      git.printCommit(commit, index);
    });
  }
};
