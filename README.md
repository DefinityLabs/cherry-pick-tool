[![Build Status](https://travis-ci.org/DefinityLabs/cherry-pick-tool.svg?branch=master)](https://travis-ci.org/DefinityLabs/cherry-pick-tool)
[![Coverage Status](https://coveralls.io/repos/github/DefinityLabs/cherry-pick-tool/badge.svg?branch=master)](https://coveralls.io/github/DefinityLabs/cherry-pick-tool?branch=master)

# 🍒 cherry-pick-tool

Cherry pick is not a common practice, but sometimes we cannot avoid it. It's a painful process, first filtering the commits you want to cherry pick and them executing the merging with the current code.

This tool was created to make this process painless. Using it you can easily navigate between the commits and add the ones you want to the cherrypick file, it doesn't matter the order, we'll sort them for you.

After you have all your commits into the cherrypick file, you can just execute it. If you don't want execute, you can save the file and do it later.

## Installation

```bash
npm install -g cherry-pick-tool
```

### Add the .cherrypick file to the .gitignore

```bash
echo '.cherrypick' >> .gitignore
git add .gitignore
git commit -m "Add .cherrypick to the .gitignore"
```

## Execute
Just execute it in your git project directory:

```bash
cherry-pick-tool
```

You don't like emoji? or maybe if you are using Windows, you can just hide them:

```bash
cherry-pick-tool --no-emoji
```

Are you looking for a specific period?

```bash
cherry-pick-tool --before 2015-04-09 09:39:23 +0100 --after 2015-03-01
```

## Commands

### Help

```
🤔  Commands:
         ? / h  Display a help message
             c  Clear the console
       <enter>  Append an empty line in the console
             o  Display the options
    <down> / n  Go to the next commit
      <up> / p  Go to the previous commit
             0  Go to the first commit
             i  Display the current commit
             f  Display the files affected by the current commit
             b  Display the body of the current commit
             v  Display the content of the cherry pick file
         + / a  Add the current commit to the cherry pick file
         - / r  Remove the current commit from the cherry pick file
             L  Load .cherrypick file if exists
             w  Save the cherry pick file as .cherrypick
             #  Clear cherry pick file it doesn't save the file
             x  Execute cherry pick
             q  Exit the application
```

