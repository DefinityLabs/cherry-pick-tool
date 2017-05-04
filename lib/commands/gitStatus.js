const cherryPick = require('../cherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 's';
  },
  help: {
    keys: 's',
    description: 'Execute git status'
  },
  execute: function() {
    cherryPick.executor().status();
  }
};
