const colors = require('colors');
const childProcess = require('child_process');

const out = require('../lib/output');
const cherryPickExecutor = require('../lib/cherryPickExecutor');

describe('cherryPickExecutor', () => {
  const testCases = [
    { method: 'apply', args: ['20af9157'], command: 'git cherry-pick 20af9157' },
    { method: 'continue', args: [], command: 'git cherry-pick --continue' },
    { method: 'abort', args: [], command: 'git cherry-pick --abort' },
    { method: 'quit', args: [], command: 'git cherry-pick --quit' },
    { method: 'status', args: [], command: 'git status' },
    {
      method: 'commitAllowEmpty',
      args: ['commit msg'],
      command: 'git commit --allow-empty -m "commit msg"'
    },
    { method: 'reset', args: [], command: 'git reset' }
  ];

  testCases.forEach(testCase => {
    let callback;

    describe(`when ${testCase.method} is called`, () => {
      beforeEach(() => {
        callback = jest.fn();
        out.println = jest.fn();
      });

      describe('with success', () => {
        beforeEach(() => {
          childProcess.exec = jest.fn((cmd, cb) => {
            cb(undefined, 'stdout', 'stderr');
          });
          let args = testCase.args.slice();
          args.push(callback);
          cherryPickExecutor[testCase.method].apply(null, args);
        });

        it('should print the git command', () => {
          expect(out.println).toHaveBeenCalledWith('$', testCase.command.gray);
        });

        it('should print empty line', () => {
          expect(out.println).toHaveBeenCalledWith();
        });

        it('should execute the git command', () => {
          expect(childProcess.exec).toHaveBeenCalledWith(testCase.command, expect.any(Function));
        });

        it('prints the git command output', () => {
          expect(out.println).toHaveBeenCalledWith('stdout');
        });

        it('calls the callback', () => {
          expect(callback).toHaveBeenCalledWith(undefined);
        });
      });

      describe('with error', () => {
        beforeEach(() => {
          childProcess.exec = jest.fn((cmd, cb) => {
            cb('error', 'stdout', 'stderr');
          });
          let args = testCase.args.slice();
          args.push(callback);
          cherryPickExecutor[testCase.method].apply(null, args);
        });

        it('should print the git command', () => {
          expect(out.println).toHaveBeenCalledWith('$', testCase.command.gray);
        });

        it('should print empty line', () => {
          expect(out.println).toHaveBeenCalledWith();
        });

        it('should execute the git command', () => {
          expect(childProcess.exec).toHaveBeenCalledWith(testCase.command, expect.any(Function));
        });

        it('prints the git command output', () => {
          expect(out.println).toHaveBeenCalledWith('stderr');
        });

        it('calls the callback', () => {
          expect(callback).toHaveBeenCalledWith('error');
        });
      });

      describe('without callback', () => {
        beforeEach(() => {
          childProcess.exec = jest.fn((cmd, cb) => {
            cb(undefined, 'stdout', 'stderr');
          });
          cherryPickExecutor[testCase.method].apply(null, testCase.args);
        });

        it('should print the git command', () => {
          expect(out.println).toHaveBeenCalledWith('$', testCase.command.gray);
        });

        it('should print empty line', () => {
          expect(out.println).toHaveBeenCalledWith();
        });

        it('should execute the git command', () => {
          expect(childProcess.exec).toHaveBeenCalledWith(testCase.command, expect.any(Function));
        });

        it('prints the git command output', () => {
          expect(out.println).toHaveBeenCalledWith('stdout');
        });

        it('should not calls the callback', () => {
          expect(callback).not.toHaveBeenCalled();
        });
      });
    });
  });
});
