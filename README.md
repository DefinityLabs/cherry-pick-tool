# cherry-pick-tool
Git Cherry Pick tool

## Installation

```bash
npm install -g cherry-pick-tool
```

## Add the .cherrypick file to the .gitignore

```bash
echo '.cherrypick' >> .gitignore
git add .gitignore
git commit -m "Add .cherrypick to the .gitignore"
```

## Help

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
