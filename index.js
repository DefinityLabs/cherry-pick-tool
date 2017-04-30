const gitlog = require('gitlog');
const keypress = require('keypress');
const colors = require('colors');
const clear = require('clear');

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

let commits = [];
let length = commits.length;
let index = -1;
let eof = false;

gitlog(options, function(errors, data){
  commits = data;
  length = commits.length;

  executeKeyPressEvent('n', 'n');
});

clear();

process.stdin.on('keypress', function(ch, key) {
  executeKeyPressEvent(ch, key);
});

function executeKeyPressEvent(ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }

  if (ch === 'n') {
    index++;
  } else if (ch === 'p') {
    index--;
  } else if (ch === 'i') {
  } else if (ch === 'c') {
    clear();
    return;
  } else if (ch === 'f') {
    printFiles(commits[index]);
    return;
  } else if (ch === 'b') {
    printBody(commits[index]);
    return;
  } else if (ch === 'q') {
    process.stdin.pause();
    return;
  } else if (ch === 'o') {
    console.log('Options:');
    console.log('  ', extra);
    console.log('');
    return;
  } else {
    return;
  }

  if (index < 0) {
    index = 0;
    return;
  }

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
          executeKeyPressEvent('n', 'n');
        } else {
          eof = true;
        }
      });
    }

    return;
  }

  let commit = commits[index];
  printCommit(commit, index);
}

function printCommit(commit, index) {
  console.log(('commit' + ' ' + commit.hash).yellow + ' (' + index + ')');
  console.log('Author: ' + commit.authorName + ' <' + commit.authorEmail + '>');
  console.log('Date:   ' + commit.authorDate + ' (' + commit.authorDateRel + ')');
  console.log('');
  console.log('  ' + commit.subject);
  console.log('');
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

function printBody(commit) {
  let body = commit.body;
  body = body.replace('\n', '\n  ');

  console.log('  ' + body);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

process.stdin.setRawMode(true);
process.stdin.resume();
