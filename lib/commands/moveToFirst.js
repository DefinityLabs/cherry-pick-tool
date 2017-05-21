const git = require('../git');
const printer = require('../printer');

module.exports = {
  canProcess: function(ch, key) {
    return ch === '0';
  },
  help: {
    keys: '0',
    description: 'Go to the first commit'
  },
  execute: function() {
    git.first(function(commit, index) {
      printer.commit(commit, index);
    });
  }
};
