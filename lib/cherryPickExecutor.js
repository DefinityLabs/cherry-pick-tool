const colors = require('colors');
const childProcess = require('child_process');

const out = require('./output');

module.exports = {
  apply: function(hash, callback) {
    let command = `git cherry-pick ${hash}`;
    executeCommand(command, callback);
  },
  continue: function(callback) {
    let command = 'git cherry-pick --continue';
    executeCommand(command, callback);
  },
  abort: function(callback) {
    let command = 'git cherry-pick --abort';
    executeCommand(command, callback);
  },
  quit: function(callback) {
    let command = 'git cherry-pick --quit';
    executeCommand(command, callback);
  },
  status: function(callback) {
    let command = 'git status';
    executeCommand(command, callback);
  },
  commitAllowEmpty: function(message, callback) {
    let command = `git commit --allow-empty -m "${message}"`;
    executeCommand(command, callback);
  },
  reset: function(callback) {
    let command = 'git reset';
    executeCommand(command, callback);
  }
};

function executeCommand(cmd, callback) {
  out.println('$', cmd.gray);
  out.println();

  childProcess.exec(cmd, function(error, stdout, stderr) {
    if (error) {
      out.println(stderr);
    } else {
      out.println(stdout);
    }
    out.println();

    if (callback) {
      callback(error);
    }
  });
}
