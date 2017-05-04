const colors = require('colors');
const exec = require('child_process').exec;

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
  console.log('$', cmd.gray);
  console.log('');

  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.error(stderr);
    } else {
      console.log(stdout);
    }
    console.log('');

    if (callback) {
      callback(error);
    }
  });
}
