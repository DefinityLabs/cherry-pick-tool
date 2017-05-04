const colors = require('colors');

const emoji = require('node-emoji');
const profile = require('./commandsProfile');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'h' || ch === '?';
  },
  help: {
    keys: '? / h',
    description: 'Display a help message'
  },
  execute: function() {
    console.log('  ' + emoji.get('thinking_face') + '  Commands:');

    profile.current().forEach(function(command){
      if (!command.help) {
        return;
      }

      let text = '  '
        + leftPad(command.help.keys, 12, ' ').yellow + '  '
        + command.help.description;
      console.log(text);
    });

    console.log('');
  }
};

function leftPad(text, length, char) {
  while (text.length < length) {
    text = char + text;
  }
  return text;
}
