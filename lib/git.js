const colors = require('colors');
const emoji = require('node-emoji');
const gitlog = require('gitlog');
const moment = require('moment');

const clone = require('./clone');
const extra = require('./extra');
const cherryPick = require('./cherryPick');

const options = {
  repo: '.',
  number: 20,
  fields: [
    'hash', 'authorName', 'authorEmail', 'authorDate',
    'authorDateRel', 'subject', 'body'
  ]
};

const DATE_PATTERN = 'YYYY-MM-DD hh:mm:ss Z';

const commits = [];
let length = 0;
let index = -1;
let eof = false;

module.exports = {
  load: function(callback) {
    loadLogs(callback);
  },
  commits: function(){
    return commits;
  },
  index: function() {
    return index;
  },
  commit: function(){
    return commits[index];
  },
  first: function(callback) {
    index = 0;
    callback(commits[index], index);
  },
  next: function(callback) {
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
            index++;
            callback(commits[index], index);
          } else {
            eof = true;
          }
        });
      }
    } else {
      callback(commits[index], index);
    }
  },
  previous: function(callback) {
    index--;

    if (index < 0) {
      index = 0;
    } else {
      callback(commits[index], index);
    }
  },
  printCommit: function(commit, index, position = true, files = false) {
    printCommit(commit, index, position, files);
  },
  printFiles: function(commit) {
    printFiles(commit);
  }
};

function loadLogs(callback) {
  if (extra.params().before) {
    options.before = extra.params().before;
  }
  if (extra.params().after) {
    options.after = extra.params().after;
  }

  gitlog(options, function(err, data){
    if (err) {
      console.log(emoji.get('shit') + '  cannot not load git log', e);
      return;
    }

    for (let i = 0; i < data.length; i++) {
      commits.push(data[i]);
    }
    length = commits.length;

    if (length == 0) {
      eof = true;
      console.log(emoji.get('see_no_evil') + '  no commits to display'.cyan);
      console.log('');
    }

    callback();
  });
}

function printCommit(commit, index, position = true, files = false) {
  let added = '';

  if (cherryPick.has(commit.hash)) {
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
