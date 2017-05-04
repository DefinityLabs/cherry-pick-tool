const colors = require('colors');
const emoji = require('node-emoji');

const profile = require('./commandsProfile');

const cherryPick = require('../cherryPick');
const iterator = require('../iterator');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'x';
  },
  help: {
    keys: 'x',
    description: 'Execute cherry pick'
  },
  execute: function() {
    let commits = cherryPick.commits();
    if (commits.length > 0) {
      profile.define('cherryPick');

      commandsIterator = new iterator(commits);

      executeCherryPick(commandsIterator);
    }
  }
};

function executeCherryPick(commandsIterator) {
  if (!commandsIterator.hasNext()) {
    console.log(emoji.get('sunglasses') + '  cherry pick was done'.green);
    console.log('');

    profile.define('default');
    return;
  }

  let commit = commandsIterator.next();
  cherryPick.executor().apply(commit.hash, function(error){
    if (!error) {
      console.log(emoji.get('thumbsup') + '  cherry pick done for commit '.cyan + commit.hash.yellow);
      console.log('');

      cherryPick.remove(commit.hash);
      executeCherryPick(commandsIterator);
    }
  });
}
