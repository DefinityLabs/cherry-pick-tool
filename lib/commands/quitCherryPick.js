const colors = require('colors');
const emoji = require('node-emoji');

const cherryPick = require('../cherryPick');
const profile = require('./commandsProfile');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'q';
  },
  help: {
    keys: 'q',
    description: 'Forget about the current operation in progress. '
               + 'Can be used to clear the sequencer state after a failed '
               + 'cherry-pick or revert'
  },
  execute: function() {
    cherryPick.executor().quit(function(error){
      if (!error) {
        let commits = cherryPick.commits();
        if (commits.length > 0) {
          let commit = commits[0];
          cherryPick.remove(commit.hash);

          console.log(emoji.get('hushed') + '  cherry pick quit'.cyan);
          console.log('');
        }
      }
    });
    profile.define('default');
  }
};
