jest.mock('gitlog');

const gitlog = require('gitlog');

const clone = require('../lib/clone');
const config = require('../lib/extra');
const emoji = require('../lib/emoji');
const git = require('../lib/git');
const out = require('../lib/output');

const defaultOptions = {
  repo: '.',
  number: 20,
  fields: ['hash', 'authorName', 'authorEmail', 'authorDate', 'authorDateRel', 'subject', 'body']
};

describe('git', () => {
  beforeAll(() => {
    out.println = jest.fn();
    emoji.get = jest.fn(name => name);
  });

  describe('with config params', () => {
    describe('load', () => {
      beforeEach(() => {
        config.params = jest.fn();
        config.params.mockReturnValue({
          after: '2017-01-01',
          before: '2017-01-31'
        });

        callback = jest.fn();
        git.load(callback);
      });

      it('should use config params to call gitlog', () => {
        let options = clone(defaultOptions);
        options.after = '2017-01-01';
        options.before = '2017-01-31';

        expect(gitlog).toHaveBeenCalledWith(options, expect.any(Function));
      });
    });
  });

  describe('when there is no git repository', () => {
    describe('load', () => {
      let callback;

      beforeEach(() => {
        config.params = jest.fn();
        config.params.mockReturnValue({});

        gitlog.mockRestore();
        gitlog.mockImplementation((opt, cb) => {
          cb('error');
        });

        callback = jest.fn();
        git.load(callback);
      });

      it('should call gitlog', () => {
        expect(gitlog).toHaveBeenCalledWith(defaultOptions, expect.any(Function));
      });

      it('prints the message "cannot load git log"', () => {
        expect(out.println).toHaveBeenCalledWith('shit', 'cannot load git log:', 'error');
      });

      it('should not call the callback', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('when there is git repository', () => {
    describe('without commits', () => {
      describe('load', () => {
        let callback;

        beforeEach(() => {
          config.params = jest.fn();
          config.params.mockReturnValue({});

          gitlog.mockImplementation((opt, cb) => {
            cb(undefined, []);
          });

          callback = jest.fn();
          git.load(callback);
        });

        it('should call gitlog', () => {
          expect(gitlog).toHaveBeenCalledWith(defaultOptions, expect.any(Function));
        });

        it('prints the message "no commits to display"', () => {
          expect(out.println).toHaveBeenCalledWith('see_no_evil', 'no commits to display'.cyan);
        });

        it('should call the callback', () => {
          expect(callback).toHaveBeenCalled();
        });

        it('defines an empty array to commits array', () => {
          expect(git.commits()).toEqual([]);
        });

        it('defines index as -1', () => {
          expect(git.index()).toEqual(-1);
        });
      });
    });

    describe('without callback', () => {
      describe('load', () => {
        let commitsLog;

        beforeEach(() => {
          commitsLog = [
            { hash: '40af9159', authorDate: '2017-01-21' },
            { hash: '30af9158', authorDate: '2017-01-15' }
          ];

          gitlog.mockImplementation((opt, cb) => {
            cb(undefined, commitsLog);
          });

          git.load();
        });

        it('should call gitlog', () => {
          expect(gitlog).toHaveBeenCalledWith(defaultOptions, expect.any(Function));
        });

        it('defines commits logs to commits array', () => {
          expect(git.commits()).toEqual(commitsLog);
        });

        it('defines index as -1', () => {
          expect(git.index()).toEqual(-1);
        });
      });
    });

    describe('with commits', () => {
      describe('load', () => {
        let loadCallback, commitsLog;

        beforeEach(() => {
          commitsLog = [
            { hash: '40af9159', authorDate: '2017-01-21' },
            { hash: '30af9158', authorDate: '2017-01-15' }
          ];

          config.params = jest.fn();
          config.params.mockReturnValue({});

          gitlog.mockImplementation((opt, cb) => {
            cb(undefined, commitsLog);
          });

          loadCallback = jest.fn();
          git.load(loadCallback);
        });

        it('should call gitlog', () => {
          expect(gitlog).toHaveBeenCalledWith(defaultOptions, expect.any(Function));
        });

        it('prints the message "cannot load git log"', () => {
          expect(out.println).toHaveBeenCalledWith('shit', 'cannot load git log:', 'error');
        });

        it('should call the callback', () => {
          expect(loadCallback).toHaveBeenCalled();
        });

        it('defines commits logs to commits array', () => {
          expect(git.commits()).toEqual(commitsLog);
        });

        it('defines index as -1', () => {
          expect(git.index()).toEqual(-1);
        });

        describe('first', () => {
          describe('without callback', () => {
            beforeEach(() => {
              git.first();
            });

            it('defines index as 0', () => {
              expect(git.index()).toEqual(0);
            });

            it('defines commit as the first item from commits array', () => {
              expect(git.commit()).toEqual(commitsLog[0]);
            });
          });

          describe('with callback', () => {
            let firstCallback;

            beforeEach(() => {
              firstCallback = jest.fn();

              git.first(firstCallback);
            });

            it('defines index as 0', () => {
              expect(git.index()).toEqual(0);
            });

            it('defines commit as the first item from commits array', () => {
              expect(git.commit()).toEqual(commitsLog[0]);
            });

            it('should call the callback with current commit and index', () => {
              expect(firstCallback).toHaveBeenCalledWith(commitsLog[0], 0);
            });
          });
        });

        describe('next', () => {
          let gitlogCalled;

          describe('without callback', () => {
            beforeEach(() => {
              gitlogCalled = 0;
              gitlog.mockImplementation((opt, cb) => {
                gitlogCalled++;
                cb(undefined, []);
              });

              git.next();
            });

            it('defines index as 0', () => {
              expect(git.index()).toEqual(0);
            });

            it('should not call gitlog', () => {
              expect(gitlogCalled).toEqual(0);
            });

            it('defines commit as the first item from commits array', () => {
              expect(git.commit()).toEqual(commitsLog[0]);
            });
          });

          describe('with callback', () => {
            let nextCallback;

            beforeEach(() => {
              gitlogCalled = 0;
              gitlog.mockImplementation((opt, cb) => {
                gitlogCalled++;
                cb(undefined, []);
              });

              nextCallback = jest.fn();

              git.next(nextCallback);
            });

            it('should not call gitlog', () => {
              expect(gitlogCalled).toEqual(0);
            });

            it('defines index as 0', () => {
              expect(git.index()).toEqual(0);
            });

            it('defines commit as the first item from commits array', () => {
              expect(git.commit()).toEqual(commitsLog[0]);
            });

            it('should call the callback with current commit and index', () => {
              expect(nextCallback).toHaveBeenCalledWith(commitsLog[0], 0);
            });

            describe('call next again', () => {
              let secondNextCallback;

              beforeEach(() => {
                secondNextCallback = jest.fn();

                gitlogCalled = 0;
                gitlog.mockImplementation((opt, cb) => {
                  gitlogCalled++;
                  cb(undefined, []);
                });

                git.next(secondNextCallback);
              });

              it('should not call gitlog', () => {
                expect(gitlogCalled).toEqual(0);
              });

              it('defines index as 1', () => {
                expect(git.index()).toEqual(1);
              });

              it('defines commit as the second item from commits array', () => {
                expect(git.commit()).toEqual(commitsLog[1]);
              });

              it('should call the callback with current commit and index', () => {
                expect(secondNextCallback).toHaveBeenCalledWith(commitsLog[1], 1);
              });

              describe('call next again (without callback)', () => {
                let olderCommitsLog;

                beforeEach(() => {
                  olderCommitsLog = [
                    { hash: '30af9158', authorDate: '2017-01-15' },
                    { hash: '20af9157', authorDate: '2017-01-01' }
                  ];

                  gitlogCalled = 0;
                  gitlog.mockImplementation((opt, cb) => {
                    gitlogCalled++;
                    cb(undefined, olderCommitsLog);
                  });

                  git.next();
                });

                it('should call gitlog', () => {
                  expect(gitlogCalled).toEqual(1);
                });

                it('defines index as 2', () => {
                  expect(git.index()).toEqual(2);
                });

                it('defines commit as the second item from commits array', () => {
                  expect(git.commit()).toEqual(commitsLog[2]);
                });
              });

              describe('call next again (without older commits)', () => {
                let thirdNextCallback;

                beforeEach(() => {
                  thirdNextCallback = jest.fn();

                  gitlogCalled = 0;
                  gitlog.mockImplementation((opt, cb) => {
                    gitlogCalled++;
                    cb(undefined, []);
                  });

                  git.next(thirdNextCallback);
                });

                it('should call gitlog', () => {
                  expect(gitlogCalled).toEqual(1);
                });

                it('defines index as 1', () => {
                  expect(git.index()).toEqual(1);
                });

                it('defines commit as the second item from commits array', () => {
                  expect(git.commit()).toEqual(commitsLog[1]);
                });

                it('should call the callback with current commit and index', () => {
                  expect(thirdNextCallback).not.toHaveBeenCalled();
                });

                describe('call next again (end of file)', () => {
                  let fourthNextCallback;

                  beforeEach(() => {
                    gitlogCalled = 0;
                    gitlog.mockImplementation((opt, cb) => {
                      gitlogCalled++;
                      cb(undefined, []);
                    });

                    fourthNextCallback = jest.fn();

                    git.next(fourthNextCallback);
                  });

                  it('should not call gitlog', () => {
                    expect(gitlogCalled).toEqual(0);
                  });

                  it('defines index as 1', () => {
                    expect(git.index()).toEqual(1);
                  });
                });
              });

              describe('call next again (loading older commits)', () => {
                let thirdNextCallback, olderCommitsLog;

                beforeEach(() => {
                  thirdNextCallback = jest.fn();

                  olderCommitsLog = [
                    { hash: '40af9159', authorDate: '2017-01-21' },
                    { hash: '30af9158', authorDate: '2017-01-15' }
                  ];

                  gitlogCalled = 0;
                  gitlog.mockImplementation((opt, cb) => {
                    gitlogCalled++;
                    cb(undefined, olderCommitsLog);
                  });

                  git.next(thirdNextCallback);
                });

                it('should call gitlog', () => {
                  expect(gitlogCalled).toEqual(1);
                });

                it('defines index as 2', () => {
                  expect(git.index()).toEqual(2);
                });

                it('defines commit as the third item from commits array', () => {
                  expect(git.commit()).toEqual(olderCommitsLog[1]);
                });

                it('should call the callback with current commit and index', () => {
                  expect(thirdNextCallback).toHaveBeenCalledWith(olderCommitsLog[1], 2);
                });
              });
            });
          });
        });

        describe('previous', () => {
          beforeEach(() => {
            git.first();
            git.next();
          });

          describe('without callback', () => {
            beforeEach(() => {
              git.previous();
            });

            it('defines index as 0', () => {
              expect(git.index()).toEqual(0);
            });

            describe('call previous again', () => {
              beforeEach(() => {
                git.previous();
              });

              it('defines index as 0', () => {
                expect(git.index()).toEqual(0);
              });
            });
          });

          describe('with callback', () => {
            let previousCallback;

            beforeEach(() => {
              previousCallback = jest.fn();

              git.previous(previousCallback);
            });

            it('defines index as 0', () => {
              expect(git.index()).toEqual(0);
            });

            it('should call the callback with current commit and index', () => {
              expect(previousCallback).toHaveBeenCalledWith(commitsLog[0], 0);
            });
          });
        });
      });
    });
  });
});
