const colors = require('colors');
const emoji = require('node-emoji');

const git = require('../git');
const cherryPick = require('../cherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'a' || ch === '+';
  },
  help: {
    keys: '+ / a',
    description: 'Add the current commit to the cherry pick file'
  },
  execute: function() {
    let commit = git.commit();

    if (!cherryPick.has(commit.hash)) {
      cherryPick.add(commit);

      console.log(emoji.get('cherries') + '  added to the cherry pick file'.green);
      console.log('');
    }
  }
};
