const colors = require('colors');
const gitlog = require('gitlog');

const clone = require('./clone');
const emoji = require('./emoji');
const config = require('./extra');
const out = require('./output');

const options = {
  repo: '.',
  number: 20,
  fields: ['hash', 'authorName', 'authorEmail', 'authorDate', 'authorDateRel', 'subject', 'body']
};

let commits = [];
let length = 0;
let index = -1;
let eof = false;

module.exports = {
  load: function(callback) {
    loadLogs(callback);
  },
  commits: function() {
    return commits;
  },
  index: function() {
    return index;
  },
  commit: function() {
    return commits[index];
  },
  first: function(callback) {
    index = 0;
    if (callback) {
      callback(commits[index], index);
    }
  },
  next: function(callback) {
    index++;

    if (index >= length) {
      index = length - 1;

      if (!eof) {
        let opt = clone(options);
        opt.before = commits[index].authorDate;

        gitlog(opt, function(errors, data) {
          if (data.length > 1) {
            for (let i = 1; i < data.length; i++) {
              commits.push(data[i]);
            }
            length += data.length - 1;
            index++;

            if (callback) {
              callback(commits[index], index);
            }
          } else {
            eof = true;
          }
        });
      }
    } else if (callback) {
      callback(commits[index], index);
    }
  },
  previous: function(callback) {
    index--;

    if (index < 0) {
      index = 0;
    } else if (callback) {
      callback(commits[index], index);
    }
  }
};

function loadLogs(callback) {
  let opt = clone(options);

  if (config.params().before) {
    opt.before = config.params().before;
  }
  if (config.params().after) {
    opt.after = config.params().after;
  }

  gitlog(opt, function(err, data) {
    if (err) {
      out.println(emoji.get('shit'), 'cannot load git log:', err);
      return;
    }

    commits = data;
    length = commits.length;
    index = -1;
    eof = false;

    if (length == 0) {
      eof = true;
      out.println(emoji.get('see_no_evil'), 'no commits to display'.cyan);
      out.println();
    }

    if (callback) {
      callback();
    }
  });
}
