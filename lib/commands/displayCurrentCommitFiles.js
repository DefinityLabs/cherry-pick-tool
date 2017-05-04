const git = require('../git');
const printer = require('../printer');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'f';
  },
  help: {
    keys: 'f',
    description: 'Display the files affected by the current commit'
  },
  execute: function() {
    printer.files(git.commit());
  }
};
