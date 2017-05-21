const fs = require('fs');
const path = require('path');

const colors = require('colors');
const moment = require('moment');

const cherryPick = require('../lib/cherryPick');
const cherryPickExecutor = require('../lib/cherryPickExecutor');
const emoji = require('../lib/emoji');
const out = require('../lib/output');

describe('cherryPick', () => {
  let firstCommit, lastCommit;

  beforeEach(() => {
    lastCommit = {
      hash: '2ad79f3c',
      authorDate: '2017-02-01 10:00:00 +00:00'
    };

    firstCommit = {
      hash: '1bd56f2a',
      authorDate: '2017-01-01 10:00:00 +00:00'
    };

    out.println = jest.fn();
    emoji.get = jest.fn(name => name);
  });

  afterEach(() => {
    cherryPick.clear();
  });

  describe('when there are no commits', () => {
    it('returns an empty array', () => {
      expect(cherryPick.commits()).toEqual([]);
    });

    it('has no commit found', () => {
      expect(cherryPick.has('2ad79f3c')).toBeFalsy();
    });
  });

  describe('executor', () => {
    it('returns cherryPickExecutor', () => {
      expect(cherryPick.executor()).toBe(cherryPickExecutor);
    });
  });

  describe('add', () => {
    describe('single commit', () => {
      let result;

      beforeEach(() => {
        result = cherryPick.add(firstCommit);
      });

      it('returns true', () => {
        expect(result).toBeTruthy();
      });

      it('found the commit by hash', () => {
        expect(cherryPick.has(firstCommit.hash)).toBeTruthy();
      });

      it('returns only the first commit', () => {
        expect(cherryPick.commits().length).toEqual(1);
        expect(cherryPick.commits()[0]).toEqual(firstCommit);
      });
    });

    describe('multiple commits in ascending order', () => {
      beforeEach(() => {
        cherryPick.add(firstCommit);
        cherryPick.add(lastCommit);
      });

      it('returns commits in ascending order', () => {
        expect(cherryPick.commits().length).toEqual(2);
        expect(cherryPick.commits()[0]).toEqual(firstCommit);
        expect(cherryPick.commits()[1]).toEqual(lastCommit);
      });
    });

    describe('multiple commits in descending order', () => {
      beforeEach(() => {
        cherryPick.add(lastCommit);
        cherryPick.add(firstCommit);
      });

      it('returns commits in ascending order', () => {
        expect(cherryPick.commits().length).toEqual(2);
        expect(cherryPick.commits()[0]).toEqual(firstCommit);
        expect(cherryPick.commits()[1]).toEqual(lastCommit);
      });
    });

    describe('multiple commits with duplicated date', () => {
      let secondCommit;

      beforeEach(() => {
        secondCommit = {
          hash: '1bd56f2b',
          authorDate: firstCommit.authorDate
        };

        cherryPick.add(firstCommit);
        cherryPick.add(secondCommit);
        cherryPick.add(lastCommit);
      });

      it('returns commits in ascending order', () => {
        expect(cherryPick.commits().length).toEqual(3);
        expect(cherryPick.commits()[0]).toEqual(firstCommit);
        expect(cherryPick.commits()[1]).toEqual(secondCommit);
        expect(cherryPick.commits()[2]).toEqual(lastCommit);
      });
    });

    describe('duplicated commit', () => {
      let result;

      beforeEach(() => {
        cherryPick.add(lastCommit);
        cherryPick.add(firstCommit);
        result = cherryPick.add(lastCommit);
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('returns commits in ascending order', () => {
        expect(cherryPick.commits().length).toEqual(2);
        expect(cherryPick.commits()[0]).toEqual(firstCommit);
        expect(cherryPick.commits()[1]).toEqual(lastCommit);
      });
    });
  });

  describe('remove', () => {
    let result;

    describe('existing commit', () => {
      beforeEach(() => {
        cherryPick.add(firstCommit);
        cherryPick.add(lastCommit);

        result = cherryPick.remove(firstCommit.hash);
      });

      it('returns true', () => {
        expect(result).toBeTruthy();
      });

      it('returns only the last commit', () => {
        expect(cherryPick.commits().length).toEqual(1);
        expect(cherryPick.commits()[0]).toEqual(lastCommit);
      });
    });

    describe('non existing commit', () => {
      beforeEach(() => {
        result = cherryPick.remove(firstCommit.hash);
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });
    });
  });

  describe('writeFile', () => {
    describe('when there are no error', () => {
      beforeEach(() => {
        fs.writeFile = jest.fn((file, data, cb) => {
          cb(undefined);
        });

        cherryPick.add(firstCommit);

        cherryPick.writeFile();
      });

      it('calls fs.writeFile', () => {
        let file = {};
        file[firstCommit.hash] = firstCommit;

        expect(fs.writeFile.mock.calls[0][0]).toEqual('.cherrypick');
        expect(fs.writeFile.mock.calls[0][1]).toEqual(JSON.stringify(file));
      });

      it('prints 2 messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints successful message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('thumbsup');
        expect(out.println.mock.calls[0][1]).toEqual('cherry pick file was saved!!!'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });
    });

    describe('when there is error', () => {
      beforeEach(() => {
        fs.writeFile = jest.fn((file, data, cb) => {
          cb('error');
        });

        cherryPick.add(firstCommit);

        cherryPick.writeFile();
      });

      it('calls fs.writeFile', () => {
        let file = {};
        file[firstCommit.hash] = firstCommit;

        expect(fs.writeFile.mock.calls[0][0]).toEqual('.cherrypick');
        expect(fs.writeFile.mock.calls[0][1]).toEqual(JSON.stringify(file));
      });

      it('prints 2 messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints successful message', () => {
        expect(out.println.mock.calls[0][0]).toEqual('shit');
        expect(out.println.mock.calls[0][1]).toEqual(
          'error writing .cherrypick file, check the privileges or if the file is already open'.red
        );
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[1][0]).toBeUndefined();
      });
    });
  });

  describe('load', () => {
    describe('when there is error to access the file', () => {
      beforeEach(() => {
        fs.access = jest.fn((file, cb) => {
          cb('error');
        });

        cherryPick.load();
      });

      it('prints two messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints message "there is no .cherrypick file"', () => {
        expect(out.println.mock.calls[0][0]).toEqual('see_no_evil');
        expect(out.println.mock.calls[0][1]).toEqual('there is no .cherrypick file'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[(1)[0]]).toBeUndefined();
      });
    });

    describe('when there is error to read the file', () => {
      beforeEach(() => {
        fs.access = jest.fn((file, cb) => {
          cb();
        });
        fs.readFile = jest.fn((file, cb) => {
          cb('error');
        });

        cherryPick.load();
      });

      it('prints two messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints message "error reading .cherrypick file, check the privileges or if the file is already open"', () => {
        expect(out.println.mock.calls[0][0]).toEqual('shit');
        expect(out.println.mock.calls[0][1]).toEqual(
          'error reading .cherrypick file, check the privileges or if the file is already open'.red
        );
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[(1)[0]]).toBeUndefined();
      });
    });

    describe('when there are no errors', () => {
      beforeEach(() => {
        let file = {};
        file[firstCommit.hash] = firstCommit;

        fs.access = jest.fn((file, cb) => {
          cb();
        });
        fs.readFile = jest.fn((file, cb) => {
          cb(undefined, JSON.stringify(file));
        });

        cherryPick.load();
      });

      it('prints two messages', () => {
        expect(out.println.mock.calls.length).toEqual(2);
      });

      it('prints message "cherry pick file was loaded!!!"', () => {
        expect(out.println.mock.calls[0][0]).toEqual('thumbsup');
        expect(out.println.mock.calls[0][1]).toEqual('cherry pick file was loaded!!!'.cyan);
      });

      it('prints an empty line', () => {
        expect(out.println.mock.calls[(1)[0]]).toBeUndefined();
      });
    });
  });
});
