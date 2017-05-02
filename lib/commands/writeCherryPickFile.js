const cherryPick = require('../cherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'w';
  },
  help: {
    keys: 'w',
    description: 'Save the cherry pick file as .cherrypick'
  },
  execute: function() {
    cherryPick.writeFile();
  }
};
