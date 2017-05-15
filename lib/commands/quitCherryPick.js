const colors = require('colors');

const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const out = require('../output');
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

          out.println(emoji.get('hushed'), 'cherry pick quit'.cyan);
          out.println();
        }
      }
    });
    profile.define('default');
  }
};
