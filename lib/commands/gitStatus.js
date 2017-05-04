const cherryPick = require('../cherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 's';
  },
  help: {
    keys: 's',
    description: 'git status'
  },
  execute: function() {
    cherryPick.executor().status();
  }
};
