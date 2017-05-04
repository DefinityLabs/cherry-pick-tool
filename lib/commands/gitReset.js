const colors = require('colors');
const emoji = require('node-emoji');

const cherryPick = require('../cherryPick');
const executeCherryPick = require('./executeCherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'r';
  },
  help: {
    keys: 'r',
    description: 'git reset'
  },
  execute: function() {
    cherryPick.executor().reset(function(error){
      if (!error) {
        let commits = cherryPick.commits();
        cherryPick.remove(commits[0].hash);

        console.log(emoji.get('hushed') + '  reset done'.cyan);
        console.log('');

        executeCherryPick.execute();
      }
    });
  }
};
