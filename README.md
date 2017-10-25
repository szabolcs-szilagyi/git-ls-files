# git-ls-files [![Build Status](https://travis-ci.org/szabolcs-szilagyi/git-ls-files.svg?branch=master)](https://travis-ci.org/szabolcs-szilagyi/git-ls-files) [![Coverage Status](https://coveralls.io/repos/github/szabolcs-szilagyi/git-ls-files/badge.svg?branch=master)](https://coveralls.io/github/szabolcs-szilagyi/git-ls-files?branch=master)

The package uses the `git ls-files` command to list all the files that are in your version control system.
It will give three default groups:
```
{
  all: []. // all the files that are in git
  js: [], // list of all JavasScript files
  test: [], // files that end with .test.js
}
```

# Why?
Why is this package interesting or how it came to be?

Its a simple thing: grunt + jshint / jscs or any other js hinter. So all projects needs a linter/hinter, but the issue with grunt and the most popular hinters, is that they get very-*very*-**very** slow, when a project has a lot of files in it and the pattern to match them isn't efficient enough.

They get slow as grunt will traverse on all the directories, even on the ones that are ignored and then starts to check the files.

An example from stackoverflow: https://stackoverflow.com/questions/24803046/grunt-js-how-to-efficiently-ignore-black-list-node-modules-folder

Here the fellow developer would have liked to ignore all that is in the `node_modules` folder, but check all `.js` files in the repository, hence they added the `!node_modules/**` pattern for jshint. However grunt will still scan all the files in that black hole called `node_modules` and while it wont hint the JavasScript files within that folder it will still be extremely slow.

So with this little package one can list and group all the important files in a project and simply give that short list to the grunt task.

Following the example from stackoverflow, one with this package can do the following:
```
const gitLsFiles = require('git-ls-files');
const files = gitLsFiles();
const config = {
    jshint: {
        scripts: files.js
    },
    watch: {
        files: files.js,
        tasks: ['jshint']
    }
};
```

Of course the above can be used for build or for zipping together deployment packages.


# API

## Example usage
```
const gitLsFiles = require('git-ls-files');
const files = gitLsFiles({
  cwd: './',
  groups: {
    myCustomGroup: /.*awesomeFiles.js$/,
    myBestGroup: function (fileName) {
      return Math.floor(Math.random() * 10) > 5;
    }
  },
});
```

## cwd [string]
Current Working Directory - this will tell the method, in which directory it should check.

## groups [object]
For each key defined in the groups, the lib will try to find matching files. The value for they hey should either be a *method* or a *regexp*.

## Result
It will be an object with list of files at the keys. For example I got the following, when ran the [above example](#example-usage) against this repo:
```
{
  myCustomGroup: [],
  myBestGroup: ['src/index.js'],
  js: [
    'Gruntfile.js',
    'src/index.js',
    'src/index.test.js',
    'test/test-common.js'
  ],
  test: ['src/index.test.js'],
  all: [
    '.gitignore',
    '.jscsrc',
    '.jshintrc',
    'Gruntfile.js',
    'package.json',
    'src/index.js',
    'src/index.test.js',
    'test/test-common.js'
  ]
}
```
