const colors = require('colors');
const emoji = require('node-emoji');

const git = require('../git');
const cherryPick = require('../cherryPick');

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

      console.log(emoji.get('knife') + '  removed from cherry pick file'.red);
      console.log('');
    }
  }
};
