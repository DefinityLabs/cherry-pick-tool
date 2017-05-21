const git = require('../git');
const out = require('../output');

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
    let padding = '  ';
    body = body.replace(/\n/g, '\n' + padding);
    out.println(padding, body);
  }
};
