const colors = require('colors');
const emoji = require('node-emoji');
const moment = require('moment');

const cherryPick = require('./cherryPick');

const DATE_PATTERN = 'YYYY-MM-DD hh:mm:ss Z';

module.exports = {
  commit: function(commit, index, position = true, files = false) {
    printCommit(commit, index, position, files);
  },

  files: function(commit) {
    printFiles(commit);
  }
};

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
