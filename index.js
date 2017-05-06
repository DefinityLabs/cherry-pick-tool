#!/usr/bin/env node

const keypress = require('keypress');
const clear = require('clear');

const out = require('./lib/output');
const extra = require('./lib/extra');
const emoji = require('./lib/emoji');
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
const gitCommitAllowEmpty = require('./lib/commands/gitCommitAllowEmpty');
const gitReset = require('./lib/commands/gitReset');

let args = process.argv;
extra.load(args);

keypress(process.stdin);

process.stdin.on('keypress', function(ch, key) {
  executeKeyPressEvent(ch, key);
});

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
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
cherryPickCommands.add(abortCherryPick);
cherryPickCommands.add(continueCherryPick);
cherryPickCommands.add(quitCherryPick);
cherryPickCommands.add(gitStatus);
cherryPickCommands.add(gitCommitAllowEmpty);
cherryPickCommands.add(gitReset);

profile.define('default');

function executeKeyPressEvent(ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    out.println(emoji.get('middle_finger'), 'next time use'.red, 'q'.yellow,
      'to exit or'.red, '?'.yellow, 'to help!'.red);
    out.println();
    process.stdin.pause();
  }

  profile.current().forEach(function(command){
    if (command.canProcess(ch, key)) {
      command.execute();
    }
  });
}

out.println(emoji.get('cherries'), 'Welcome to the Cherry Pick Tool!');
out.println();
out.println('If you need help, press', 'h'.yellow, 'or', '?'.yellow, 'anytime.');
out.println();
out.println();

git.load(function(){
  moveToNext.execute();
});
