const colors = require('colors');

const cherryPick = require('../cherryPick');
const git = require('../git');
const emoji = require('../emoji');
const out = require('../output');

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

      out.println(emoji.get('cherries'), 'added to the cherry pick file'.green);
      out.println();
    }
  }
};
