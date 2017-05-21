const colors = require('colors');

const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const out = require('../output');
const profile = require('./commandsProfile');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'a';
  },
  help: {
    keys: 'a',
    description: 'Cancel the operation and return to the pre-sequence state'
  },
  execute: function() {
    cherryPick.executor().abort(function(error) {
      if (!error) {
        out.println(emoji.get('worried'), 'cherry pick aborted'.cyan);
        out.println();
      }
    });
    profile.define('default');
  }
};
