const keypress = require('keypress');
const clear = require('clear');
const emoji = require('node-emoji');

const git = require('./lib/git');
const commands = require('./lib/commands/commands');
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
const writeCherryPickFile = require('./lib/commands/writeCherryPickFile');
const clearCherryPickFile = require('./lib/commands/clearCherryPickFile');

const extra = {};

let args = process.argv;

for (let i = 2; i < args.length; i++) {
  let arg = args[i];
  if (arg === '--before') {
    options.before = args[++i];
    extra.before = options.before;
  } else if (arg === '--after') {
    options.after = args[++i];
    extra.after = options.after;
  }
}

keypress(process.stdin);

process.stdin.on('keypress', function(ch, key) {
  executeKeyPressEvent(ch, key);
});

process.stdin.setRawMode(true);
process.stdin.resume();

clear();

commands.add(help);
commands.add(clearConsole);
commands.add(appendEmptyLineInConsole);
commands.add(displayOptions);
commands.add(moveToNext);
commands.add(moveToPrevious);
commands.add(moveToFirst);
commands.add(displayCurrentCommit);
commands.add(displayCurrentCommitFiles);
commands.add(displayCurrentCommitBody);
commands.add(displayCherryPickFile);
commands.add(addCommitToCherryPickFile);
commands.add(removeCommitFromCherryPickFile);
commands.add(writeCherryPickFile);
commands.add(clearCherryPickFile);
commands.add(quit);

function executeKeyPressEvent(ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log(emoji.get('reversed_hand_with_middle_finger_extended') + '  next time use '.red + 'q'.yellow + ' to exit or '.red + '?'.yellow + ' to help!'.red);
    console.log('');
    process.stdin.pause();
  }

  commands.forEach(function(command){
    if (command.canProcess(ch, key)) {
      command.execute();
    }
  });
}

git.load(function(){
  moveToNext.execute();
});