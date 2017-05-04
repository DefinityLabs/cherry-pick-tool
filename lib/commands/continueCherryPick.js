const colors = require('colors');
const emoji = require('node-emoji');

const cherryPick = require('../cherryPick');
const executeCherryPick = require('./executeCherryPick');
const help = require('./help');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'c';
  },
  help: {
    keys: 'c',
    description: 'Continue the operation in progress using the information in '
               + '.git/sequencer. Can be used to continue after resolving '
               + 'conflicts in a failed cherry-pick or revert'
  },
  execute: function() {
    cherryPick.executor().continue(function(error){
      let commits = cherryPick.commits();
      let commit = commits[0];

      if (!error) {
        cherryPick.remove(commit.hash);

        console.log(emoji.get('thumbsup') + '  cherry pick done for commit '.cyan
          + commit.hash.yellow);

        executeCherryPick.execute();
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
};
