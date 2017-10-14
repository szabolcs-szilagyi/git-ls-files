var os = require('os');
var fs = require('fs');
var cp = require('child_process');
var expect = require('chai').expect;

var gitFiles = require('./index');

var TEMP_NAME = Date.now();
var TEMP_DIR = os.tmpdir() + '/' + TEMP_NAME;

function setup () {
  var exec = function (cmd) {
    return cp.execSync(cmd, { encoding: 'utf8', cwd: TEMP_DIR });
  };

  fs.mkdirSync(TEMP_DIR);

  exec('echo hello > committed.txt');
  exec('echo haha > some.test.js');
  exec('echo hoho > some.js');
  exec('git init');
  exec('git add .');
  exec('git commit --no-gpg-sign -am test');
  exec('echo bello > staged.txt');
  exec('git add .');
}

function teardown () {
  cp.execSync('rm -rf', [TEMP_DIR]);
}

describe('git-files', function () {
  var result;

  before(function () {
    setup();
    result = gitFiles({ cwd: TEMP_DIR });
  });
  after(teardown);

  it('returns an object of arrays', function () {
    expect(result).to.be.an('object');
  });

  it('options are optional', function () {
    expect(gitFiles).not.to.throw();
  });

  it('gives back some default file groups', function () {
    expect(result).to.have.all.keys('all', 'js', 'test');
  });

  it('lists files in the right groups', function () {
    expect(result.all).to.have.members([
      'committed.txt', 'some.test.js', 'some.js', 'staged.txt'
    ]);
    expect(result.js).to.have.members(['some.test.js', 'some.js']);
    expect(result.test).to.have.members(['some.test.js']);
  });

  it('will return other groups if they are configured', function () {
    var custom = gitFiles({
      cwd: TEMP_DIR,
      groups: {
        extra: /.*/
      }
    });

    expect(custom).to.have.a.property('extra');
    expect(custom.extra).to.have.lengthOf(result.all.length);
    expect(custom.js).to.have.members(['some.test.js', 'some.js']);
  });

  it('allows configuration of groups with functions as well', function () {
    var custom = gitFiles({
      cwd: TEMP_DIR,
      groups: {
        somethingOther: function (fileName) {
          return ['some.js', 'staged.txt'].indexOf(fileName) !== -1;
        }
      }
    });

    expect(custom).to.have.a.property('somethingOther');
    expect(custom.somethingOther).to.have.members(['some.js', 'staged.txt']);
  });

  it('allows overriding groups, except the `all` group', function () {
    var custom = gitFiles({
      cwd: TEMP_DIR,
      groups: {
        all: /^$/,
        js: /\.txt$/
      }
    });

    expect(custom.js).to.have.members(['committed.txt', 'staged.txt']);
    expect(custom.all).to.have.members([
      'committed.txt', 'some.test.js', 'some.js', 'staged.txt'
    ]);
  });
});
