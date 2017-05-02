const colors = require('colors');
const emoji = require('node-emoji');
const fs = require('fs');
const moment = require('moment');

const DATE_PATTERN = 'YYYY-MM-DD hh:mm:ss Z';

const file = {};

module.exports = {
  commits: function() {
    let array = [];

    let keys = Object.keys(file);
    keys.forEach(function(key){
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

function clearCherryPickFile() {
  let keys = Object.keys(file);
  keys.forEach(function(key){
    delete file[key];
  });
}

function sortCherryPickFile() {
  let array = [];

  let keys = Object.keys(file);
  keys.forEach(function(key){
    array.push(file[key]);
  });

  array.sort(compareCommits);

  clearCherryPickFile();

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
