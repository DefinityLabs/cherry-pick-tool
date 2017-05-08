const colors = require('colors');

const profile = require('./commandsProfile');

const emoji = require('../emoji');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'h' || ch === '?';
  },
  help: {
    keys: '? / h',
    description: 'Display a help message'
  },
  execute: function() {
    out.println(emoji.get('thinking_face'), 'Commands:');

    let currentProfile = profile.current();
    if (currentProfile) {
      currentProfile.forEach(function(command){
        if (!command.help) {
          return;
        }

        let text = '  '
          + leftPad(command.help.keys, 12, ' ').yellow + '  '
          + command.help.description;
        out.println(text);
      });
    }
    
    out.println();
  }
};

function leftPad(text, length, char) {
  while (text.length < length) {
    text = char + text;
  }
  return text;
}
