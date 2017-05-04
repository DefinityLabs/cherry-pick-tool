const colors = require('colors');

const cherryPick = require('../cherryPick');
const git = require('../git');
const printer = require('../printer');

module.exports = {
  canProcess: function(ch, key) {
    return ch === 'v';
  },
  help: {
    keys: 'v',
    description: 'Display the content of the cherry pick file'
  },
  execute: function() {
    console.log('============ BEGIN OF CHERRY PICK FILE ============'.cyan);
    console.log('');

    let commits = cherryPick.commits();
    if (commits.length === 0) {
      console.log('File is empty');
      console.log('');
    }

    commits.forEach(function(commit){
      printer.commit(commit, -1, false, true);
    });

    console.log('============= END OF CHERRY PICK FILE ============='.cyan);
    console.log('');
  }
};
