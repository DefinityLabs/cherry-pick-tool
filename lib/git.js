const colors = require('colors');
const emoji = require('node-emoji');
const gitlog = require('gitlog');

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
