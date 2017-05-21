const colors = require('colors');

const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === '#';
  },
  help: {
    keys: '#',
    description: 'Clear cherry pick file ' + "it doesn't save the file".underline
  },
  execute: function() {
    cherryPick.clear();

    out.println(emoji.get('wastebasket'), 'cherry pick file is empty'.cyan);
    out.println();
  }
};
