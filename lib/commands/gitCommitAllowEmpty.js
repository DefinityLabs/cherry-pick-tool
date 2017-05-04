const colors = require('colors');
const emoji = require('node-emoji');

const cherryPick = require('../cherryPick');
const executeCherryPick = require('./executeCherryPick');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'e';
  },
  help: {
    keys: 'e',
    description: 'git commit --allow-empty'
  },
  execute: function() {
    let commit = cherryPick.commits()[0];
    cherryPick.executor().commitAllowEmpty(`Cherry pick empty commit ${commit.hash}`, function(error){
      if (!error) {
        cherryPick.remove(commit.hash);

        console.log(emoji.get('no_mouth') + '  commit done'.cyan);
        console.log('');

        executeCherryPick.execute();
      }
    });
  }
};
