const git = require('../git');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'b';
  },
  help: {
    keys: 'b',
    description: 'Display the body of the current commit'
  },
  execute: function() {
    let commit = git.commit();
    let body = commit.body;
    body = body.replace('\n', '\n  ');
    console.log('  ' + body);
  }
};
