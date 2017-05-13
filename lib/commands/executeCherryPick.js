const colors = require('colors');

const profile = require('./commandsProfile');
const help = require('./help');

const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const iterator = require('../iterator');
const out = require('../output');

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
    out.println(emoji.get('sunglasses'), 'cherry pick was done'.green);
    out.println();

    profile.define('default');
    return;
  }

  let commit = commandsIterator.next();
  cherryPick.executor().apply(commit.hash, function(error){
    if (!error) {
      out.println(emoji.get('thumbsup'), '  cherry pick done for commit '.cyan
        + commit.hash.yellow);
      out.println();

      cherryPick.remove(commit.hash);
      executeCherryPick(commandsIterator);
    } else {
      out.println(emoji.get('thumbsdown'), '  cannot cherry pick commit '.red
        + commit.hash.yellow);
      out.println();
      out.println('What would you like to do?');
      out.println();
      help.execute();
    }
  });
}
