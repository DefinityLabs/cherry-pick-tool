const colors = require('colors');

const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const git = require('../git');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'r' || ch === '-';
  },
  help: {
    keys: '- / r',
    description: 'Remove the current commit from the cherry pick file'
  },
  execute: function() {
    let commit = git.commit();
    if (cherryPick.has(commit.hash)) {
      cherryPick.remove(commit.hash);

      out.println(emoji.get('knife'), 'removed from cherry pick file'.red);
      out.println();
    }
  }
};
