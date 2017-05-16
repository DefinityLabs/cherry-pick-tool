const colors = require('colors');

const executeCherryPick = require('./executeCherryPick');
const cherryPick = require('../cherryPick');
const emoji = require('../emoji');
const out = require('../output');

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

        out.println(emoji.get('no_mouth'), 'commit done'.cyan);
        out.println();

        executeCherryPick.execute();
      }
    });
  }
};
