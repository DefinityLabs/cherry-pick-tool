const colors = require('colors');

const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const executeCherryPick = require('./executeCherryPick');
const out = require('../output');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'r';
  },
  help: {
    keys: 'r',
    description: 'git reset'
  },
  execute: function() {
    cherryPick.executor().reset(function(error) {
      if (!error) {
        let commits = cherryPick.commits();
        if (commits.length > 0) {
          cherryPick.remove(commits[0].hash);
        }

        out.println(emoji.get('hushed'), 'reset done'.cyan);
        out.println();

        executeCherryPick.execute();
      }
    });
  }
};
