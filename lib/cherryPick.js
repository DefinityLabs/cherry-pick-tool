const fs = require('fs');
const path = require('path');

const colors = require('colors');
const moment = require('moment');

const cherryPickExecutor = require('./cherryPickExecutor');
const emoji = require('./emoji');
const out = require('./output');

const DATE_PATTERN = 'YYYY-MM-DD hh:mm:ss Z';

const file = {};

module.exports = {
  commits: function() {
    let array = [];

    let keys = Object.keys(file);
    keys.forEach(function(key) {
      array.push(file[key]);
    });

    array.sort(compareCommits);

    return array;
  },
  has: function(hash) {
    return file[hash] !== undefined;
  },
  add: function(commit) {
    if (file[commit.hash] === undefined) {
      file[commit.hash] = commit;
      sortCherryPickFile();

      return true;
    } else {
      return false;
    }
  },
  remove: function(hash) {
    if (file[hash] !== undefined) {
      delete file[hash];
      sortCherryPickFile();

      return true;
    } else {
      return false;
    }
  },
  clear: function() {
    clearCherryPickFile();
  },
  writeFile: function() {
    fs.writeFile('.cherrypick', JSON.stringify(file), function(err) {
      if (err) {
        out.println(
          emoji.get('shit'),
          'error writing .cherrypick file, check the privileges or if the file is already open'.red
        );
      } else {
        out.println(emoji.get('thumbsup'), 'cherry pick file was saved!!!'.cyan);
      }
      out.println();
    });
  },
  load: function() {
    fs.access('.cherrypick', function(err) {
      if (err) {
        out.println(emoji.get('see_no_evil'), 'there is no .cherrypick file'.cyan);
        out.println();
        return;
      }
      fs.readFile('.cherrypick', function(err, data) {
        if (err) {
          out.println(
            emoji.get('shit'),
            'error reading .cherrypick file, check the privileges or if the file is already open'
              .red
          );
        } else {
          clearCherryPickFile();
          loadCherryPickFile(data);
          out.println(emoji.get('thumbsup'), 'cherry pick file was loaded!!!'.cyan);
        }
        out.println();
      });
    });
  },
  executor: function() {
    return cherryPickExecutor;
  }
};

function clearCherryPickFile() {
  let keys = Object.keys(file);
  keys.forEach(function(key) {
    delete file[key];
  });
}

function loadCherryPickFile(data) {
  let cherryPickFile = JSON.parse(data);

  let keys = Object.keys(cherryPickFile);
  keys.forEach(function(key) {
    file[key] = cherryPickFile[key];
  });
}

function sortCherryPickFile() {
  let array = [];

  let keys = Object.keys(file);
  keys.forEach(function(key) {
    array.push(file[key]);
  });

  array.sort(compareCommits);

  clearCherryPickFile();

  array.forEach(function(commit) {
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
