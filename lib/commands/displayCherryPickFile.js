const colors = require('colors');

const cherryPick = require('../cherryPick');
const git = require('../git');
const out = require('../output');
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
    out.println('============ BEGIN OF CHERRY PICK FILE ============'.cyan);
    out.println();

    let commits = cherryPick.commits();
    if (commits.length === 0) {
      out.println('File is empty');
      out.println();
    }

    commits.forEach(function(commit) {
      printer.commit(commit, -1, false, true);
    });

    out.println('============= END OF CHERRY PICK FILE ============='.cyan);
    out.println();
  }
};
