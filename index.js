const fs = require('fs');
const gitlog = require('gitlog');
const keypress = require('keypress');
const colors = require('colors');
const clear = require('clear');
const moment = require('moment');
const emoji = require('node-emoji');

const DATE_PATTERN = 'YYYY-MM-DD hh:mm:ss Z';

const options = {
  repo: '.',
  number: 20,
  fields: [
    'hash', 'authorName', 'authorEmail', 'authorDate',
    'authorDateRel', 'subject', 'body'
  ]
};

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

let commits = [];
let file = {};
let length = 0;
let index = -1;
let eof = false;

gitlog(options, function(errors, data){
  commits = data;
  length = commits.length;

  executeKeyPressEvent('n', 'n');
});

clear();

const commands = [];
commands.push(help());
commands.push(clearConsole());
commands.push(appendEmptyLineInConsole());
commands.push(displayOptions());
commands.push(moveToNext());
commands.push(moveToPrevious());
commands.push(moveToZero());
commands.push(displayCurrentCommit());
commands.push(displayCurrentCommitFiles());
commands.push(displayCurrentCommitBody());
commands.push(displayCherryPickFile());
commands.push(addCommitToCherryPickFile());
commands.push(removeCommitFromCherryPickFile());
commands.push(writeCherryPickFile());
commands.push(clearCherryPickFile());
commands.push(quit());

function quit() {
  return {
    canProcess: function(ch, key) {
      return ch === 'q';
    },
    help: {
      keys: 'q',
      description: 'Exit the application'
    },
    execute: function() {
      console.log(emoji.get('wave') + '  bye');
      console.log('');
      process.stdin.pause();
    }
  };
}

function help() {
  return {
    canProcess: function(ch, key) {
      return ch === 'h' || ch === '?';
    },
    help: {
      keys: '? / h',
      description: 'Display a help message'
    },
    execute: function() {
      console.log('  ' + emoji.get('thinking_face') + '  Commands:');

      commands.forEach(function(command){
        if (!command.help) {
          return;
        }

        let text = '  '
          + leftPad(command.help.keys, 12, ' ').yellow + '  '
          + command.help.description;
        console.log(text);
      });

      console.log('');
    }
  };
}

function clearConsole() {
  return {
    canProcess: function(ch, key) {
      return ch === 'c';
    },
    help: {
      keys: 'c',
      description: 'Clear the console'
    },
    execute: function() {
      console.log(emoji.get('sleeping'));
      console.log('');
      clear();
    }
  };
}

function displayOptions() {
  return {
    canProcess: function(ch, key) {
      return ch === 'o';
    },
    help: {
      keys: 'o',
      description: 'Display the options'
    },
    execute: function() {
      console.log('Options:');
      console.log('  ', extra);
      console.log('');
    }
  };
}

function moveToNext() {
  return {
    canProcess: function(ch, key) {
      return ch === 'n' || (key !== undefined && key.name === 'down');
    },
    help: {
      keys: '<down> / n',
      description: 'Go to the next commit'
    },
    execute: function() {
      index++;

      if (index >= length) {
        index = length - 1;

        if (!eof) {
          let opt = clone(options);
          opt.before = commits[index].authorDate;

          gitlog(opt, function(errors, data){
            if (data.length > 1) {
              for (let i = 1; i < data.length; i++) {
                commits.push(data[i]);
              }
              length += data.length - 1;
              executeKeyPressEvent('n', {});
            } else {
              eof = true;
            }
          });
        }
      } else {
        printCommit(commits[index], index);
      }
    }
  };
}

function moveToPrevious() {
  return {
    canProcess: function(ch, key) {
      return ch === 'p' || (key !== undefined && key.name === 'up');
    },
    help: {
      keys: '<up> / p',
      description: 'Go to the previous commit'
    },
    execute: function() {
      index--;

      if (index < 0) {
        index = 0;
      } else {
        printCommit(commits[index], index);
      }
    }
  };
}

function moveToZero() {
  return {
    canProcess: function(ch, key) {
      return ch === '0';
    },
    help: {
      keys: '0',
      description: 'Go to the first commit'
    },
    execute: function() {
      index = 0;
      printCommit(commits[index], index);
    }
  };
}

function displayCurrentCommit() {
  return {
    canProcess: function(ch, key) {
      return ch === 'i';
    },
    help: {
      keys: 'i',
      description: 'Display the current commit'
    },
    execute: function() {
      printCommit(commits[index], index);
    }
  };
}

function displayCurrentCommitFiles() {
  return {
    canProcess: function(ch, key) {
      return ch === 'f';
    },
    help: {
      keys: 'f',
      description: 'Display the files affected by the current commit'
    },
    execute: function() {
      printFiles(commits[index]);
    }
  };
}

function displayCurrentCommitBody() {
  return {
    canProcess: function(ch, key) {
      return ch === 'b';
    },
    help: {
      keys: 'b',
      description: 'Display the body of the current commit'
    },
    execute: function() {
      let commit = commits[index];
      let body = commit.body;
      body = body.replace('\n', '\n  ');
      console.log('  ' + body);
    }
  };
}

function displayCherryPickFile() {
  return {
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

      let keys = Object.keys(file);
      if (keys.length === 0) {
        console.log('File is empty');
        console.log('');
      }

      keys.forEach(function(key){
        printCommit(file[key], -1, false, true);
      });

      console.log('============= END OF CHERRY PICK FILE ============='.cyan);
      console.log('');
    }
  };
}

function addCommitToCherryPickFile() {
  return {
    canProcess: function(ch, key) {
      return ch === 'a' || ch === '+';
    },
    help: {
      keys: '+ / a',
      description: 'Add the current commit to the cherry pick file'
    },
    execute: function() {
      if (file[commits[index].hash] === undefined) {
        file[commits[index].hash] = commits[index];
        sortCherryPickFile();

        console.log(emoji.get('cherries') + '  added to the cherry pick file'.green);
        console.log('');
      }
    }
  };
}

function removeCommitFromCherryPickFile() {
  return {
    canProcess: function(ch, key) {
      return ch === 'r' || ch === '-';
    },
    help: {
      keys: '- / r',
      description: 'Remove the current commit from the cherry pick file'
    },
    execute: function() {
      if (file[commits[index].hash] !== undefined) {
        delete file[commits[index].hash];
        sortCherryPickFile();

        console.log(emoji.get('knife') + '  removed from cherry pick file'.red);
        console.log('');
      }
    }
  };
}

function writeCherryPickFile() {
  return {
    canProcess: function(ch, key) {
      return ch === 'w';
    },
    help: {
      keys: 'w',
      description: 'Save the cherry pick file as .cherrypick'
    },
    execute: function() {
      sortCherryPickFile();

      fs.writeFile('.cherrypick', JSON.stringify(file), function(err){
        if (err) {
          console.error(emoji.get('shit') + '  error writing file .cherrypick file, check the privileges or if the file is already open'.red, err);
        } else {
          console.log(emoji.get('thumbsup') + '  cherry pick file was saved!!!'.cyan);
        }
        console.log('');
      });
    }
  };
}

function clearCherryPickFile() {
  return {
    canProcess: function(ch, key) {
      return ch === '#';
    },
    help: {
      keys: '#',
      description: 'Clear cherry pick file ' + 'it doesn\'t save the file'.underline
    },
    execute: function() {
      file = {};

      console.log(emoji.get('wastebasket') + '  cherry pick file is empty'.cyan);
      console.log('');
    }
  };
}

function appendEmptyLineInConsole() {
  return {
    canProcess: function(ch, key) {
      return (key !== undefined && (key.name === 'return' || key.name === 'enter'));
    },
    help: {
      keys: '<enter>',
      description: 'Append an empty line in the console'
    },
    execute: function() {
      console.log('');
    }
  };
}

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

function sortCherryPickFile() {
  let array = [];

  let keys = Object.keys(file);
  keys.forEach(function(key){
    array.push(file[key]);
  });

  array.sort(compareCommits);

  file = {};

  array.forEach(function(commit){
    file[commit.hash] = commit;
  });
}

function compareCommits(commit1, commit2) {
  let commit1Date = moment(commit1.authorDate, DATE_PATTERN);
  let commit2Date = moment(commit2.authorDate, DATE_PATTERN);

  if (commit1Date < commit2Date) {
    return -1;
  }
  if (commit1Date > commit2Date) {
    return 1;
  }
  return 0;
}

function printCommit(commit, index, position = true, files = false) {
  let added = '';

  if (file[commit.hash] !== undefined) {
    added = emoji.get('cherries');
  }

  let textPosition = ' (' + ('' + index).cyan + ') ';

  let dateInCurrentTimeZone = moment(commit.authorDate, DATE_PATTERN).format('ddd MMM DD, ');
  let timeInCurrentTimeZone = moment(commit.authorDate, DATE_PATTERN).format('hh:mm:ssA');

  let dateInCommitTimeZone = moment.parseZone(commit.authorDate, DATE_PATTERN).format('ddd MMM DD, ');
  let timeInCommitTimeZone = moment.parseZone(commit.authorDate, DATE_PATTERN).format('hh:mm:ssA');

  let commitTimeZone = moment.parseZone(commit.authorDate, DATE_PATTERN).format('Z');

  let date;
  let time;

  if (timeInCurrentTimeZone === timeInCommitTimeZone) {
    time = dateInCurrentTimeZone + timeInCurrentTimeZone;
  } else {
    date = '';
    if (dateInCurrentTimeZone !== dateInCommitTimeZone) {
      date = dateInCommitTimeZone;
    }

    time = dateInCurrentTimeZone + timeInCurrentTimeZone + (' (' + date + timeInCommitTimeZone + ' ' + commitTimeZone + ')').gray;
  }

  console.log(('commit' + ' ' + commit.hash).yellow + (position ? textPosition : '') + ' ' + added);
  console.log('Author: ' + commit.authorName + ' <' + commit.authorEmail + '>');
  console.log('Date:   ' + time + ' (' + commit.authorDateRel.magenta + ')');
  console.log('');
  console.log('  ' + commit.subject);
  console.log('');

  if (files) {
    printFiles(commit);
  }
}

function printFiles(commit) {
  let status = commit.status;
  let files = commit.files;

  for (let i = 0; i < files.length; i++) {
    let text = '  ' + status[i] + ' ' + files[i];

    if (status[i] === 'A') {
      console.log(text.green);
    } else if (status[i] === 'D') {
      console.log(text.red);
    } else if (status[i] === 'M') {
      console.log(text.blue);
    } else {
      console.log(text);
    }
  }
  console.log('');
}

function leftPad(text, length, char) {
  while (text.length < length) {
    text = char + text;
  }
  return text;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
