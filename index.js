const keypress = require('keypress');
const clear = require('clear');
const emoji = require('node-emoji');

const extra = require('./lib/extra');

const git = require('./lib/git');
const profile = require('./lib/commands/commandsProfile');
const quit = require('./lib/commands/quit');
const help = require('./lib/commands/help');
const clearConsole = require('./lib/commands/clearConsole');
const appendEmptyLineInConsole = require('./lib/commands/appendEmptyLineInConsole');
const displayOptions = require('./lib/commands/displayOptions');
const moveToNext = require('./lib/commands/moveToNext');
const moveToPrevious = require('./lib/commands/moveToPrevious');
const moveToFirst = require('./lib/commands/moveToFirst');
const displayCurrentCommit = require('./lib/commands/displayCurrentCommit');
const displayCurrentCommitFiles = require('./lib/commands/displayCurrentCommitFiles');
const displayCurrentCommitBody = require('./lib/commands/displayCurrentCommitBody');
const displayCherryPickFile = require('./lib/commands/displayCherryPickFile');
const addCommitToCherryPickFile = require('./lib/commands/addCommitToCherryPickFile');
const removeCommitFromCherryPickFile = require('./lib/commands/removeCommitFromCherryPickFile');
const loadCherryPickFile = require('./lib/commands/loadCherryPickFile');
const writeCherryPickFile = require('./lib/commands/writeCherryPickFile');
const executeCherryPick = require('./lib/commands/executeCherryPick');
const clearCherryPickFile = require('./lib/commands/clearCherryPickFile');
const abortCherryPick = require('./lib/commands/abortCherryPick');
const continueCherryPick = require('./lib/commands/continueCherryPick');
const quitCherryPick = require('./lib/commands/quitCherryPick');
const gitStatus = require('./lib/commands/gitStatus');

let args = process.argv;

for (let i = 2; i < args.length; i++) {
  let arg = args[i];
  if (arg === '--before') {
    extra.param("before", args[++i]);
  } else if (arg === '--after') {
    extra.param("after", args[++i]);
  }
}

keypress(process.stdin);

process.stdin.on('keypress', function(ch, key) {
  executeKeyPressEvent(ch, key);
});

process.stdin.setRawMode(true);
process.stdin.resume();

clear();

const defaultCommands = profile.get('default');
defaultCommands.add(help);
defaultCommands.add(clearConsole);
defaultCommands.add(appendEmptyLineInConsole);
defaultCommands.add(displayOptions);
defaultCommands.add(moveToNext);
defaultCommands.add(moveToPrevious);
defaultCommands.add(moveToFirst);
defaultCommands.add(displayCurrentCommit);
defaultCommands.add(displayCurrentCommitFiles);
defaultCommands.add(displayCurrentCommitBody);
defaultCommands.add(displayCherryPickFile);
defaultCommands.add(addCommitToCherryPickFile);
defaultCommands.add(removeCommitFromCherryPickFile);
defaultCommands.add(loadCherryPickFile);
defaultCommands.add(writeCherryPickFile);
defaultCommands.add(clearCherryPickFile);
defaultCommands.add(executeCherryPick);
defaultCommands.add(quit);

const cherryPickCommands = profile.get('cherryPick');
cherryPickCommands.add(help);
cherryPickCommands.add(appendEmptyLineInConsole);
cherryPickCommands.add(gitStatus);
cherryPickCommands.add(abortCherryPick);
cherryPickCommands.add(continueCherryPick);
cherryPickCommands.add(quitCherryPick);

profile.define('default');

function executeKeyPressEvent(ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log(emoji.get('middle_finger') + '  next time use '.red + 'q'.yellow + ' to exit or '.red + '?'.yellow + ' to help!'.red);
    console.log('');
    process.stdin.pause();
  }

  profile.current().forEach(function(command){
    if (command.canProcess(ch, key)) {
      command.execute();
    }
  });
}

git.load(function(){
  moveToNext.execute();
});
