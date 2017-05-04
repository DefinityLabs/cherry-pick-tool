const colors = require('colors');
const emoji = require('node-emoji');

const cherryPick = require('../cherryPick');
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
    cherryPick.executor().abort(function(error){
      if (!error) {
        console.log(emoji.get('worried') + '  cherry pick aborted'.cyan);
        console.log('');
      }
    });
    profile.define('default');
  }
};
