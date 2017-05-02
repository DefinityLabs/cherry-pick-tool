const cherryPick = require('../cherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'L';
  },
  help: {
    keys: 'L',
    description: 'Load .cherrypick file if exists'
  },
  execute: function() {
    cherryPick.load();
  }
};
