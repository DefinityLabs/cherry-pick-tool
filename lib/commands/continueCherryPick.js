const cherryPick = require('../cherryPick');

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
      if (!error) {
        let commits = cherryPick.commits();
        cherryPick.remove(commits[0].hash);

        console.log(emoji.get('thumbsup') + '  cherry pick done for commit '.cyan + commit.hash.yellow);
      }
    });
  }
};
