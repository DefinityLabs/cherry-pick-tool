const colors = require('colors');
const emoji = require('node-emoji');

const profile = require('./commandsProfile');
const help = require('./help');

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
    } else {
      profile.define('default');
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
      console.log(emoji.get('thumbsup') + '  cherry pick done for commit '.cyan
        + commit.hash.yellow);
      console.log('');

      cherryPick.remove(commit.hash);
      executeCherryPick(commandsIterator);
    } else {
      console.log(emoji.get('thumbsdown') + '  cannot cherry pick commit '.red
        + commit.hash.yellow);
      console.log('');
      console.log('What would you like to do?');
      console.log('');
      help.execute();
    }
  });
}
