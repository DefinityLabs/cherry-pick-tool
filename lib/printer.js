const colors = require('colors');
const moment = require('moment');

const cherryPick = require('./cherryPick');
const emoji = require('./emoji');
const out = require('./output');

const DATE_PATTERN = 'YYYY-MM-DD hh:mm:ss Z';

module.exports = {
  commit: function(commit, index, position = true, files = false) {
    printCommit(commit, index, position, files);
  },

  files: function(commit) {
    printFiles(commit);
  }
};

function printCommit(commit, index, position, files) {
  let added = '';

  if (cherryPick.has(commit.hash)) {
    added = emoji.get('cherries');
  }

  let textPosition = '';
  if (position) {
    textPosition = '(' + ('' + index).cyan + ')';
  }

  let dateInCurrentTimeZone = moment(commit.authorDate, DATE_PATTERN).format('ddd MMM DD, ');
  let timeInCurrentTimeZone = moment(commit.authorDate, DATE_PATTERN).format('hh:mm:ssA');

  let dateInCommitTimeZone = moment
    .parseZone(commit.authorDate, DATE_PATTERN)
    .format('ddd MMM DD, ');
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

    time =
      dateInCurrentTimeZone +
      timeInCurrentTimeZone +
      (' (' + date + timeInCommitTimeZone + ' ' + commitTimeZone + ')').gray;
  }

  out.println(('commit ' + commit.hash).yellow, textPosition, added);
  out.println('Author: ', commit.authorName, ' <' + commit.authorEmail + '>');
  out.println('Date:   ', time, ' (' + commit.authorDateRel.magenta + ')');
  out.println();
  out.println('  ', commit.subject);
  out.println();

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
      out.println(text.green);
    } else if (status[i] === 'D') {
      out.println(text.red);
    } else if (status[i] === 'M') {
      out.println(text.blue);
    } else {
      out.println(text);
    }
  }
  out.println();
}
