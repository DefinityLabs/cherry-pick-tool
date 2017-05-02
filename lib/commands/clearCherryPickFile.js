const colors = require('colors');
const emoji = require('node-emoji');

const cherryPick = require('../cherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === '#';
  },
  help: {
    keys: '#',
    description: 'Clear cherry pick file ' + 'it doesn\'t save the file'.underline
  },
  execute: function() {
    cherryPick.clear();

    console.log(emoji.get('wastebasket') + '  cherry pick file is empty'.cyan);
    console.log('');
  }
};
