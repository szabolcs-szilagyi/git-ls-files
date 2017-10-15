'use strict';

var execSync = require('child_process').execSync;

var JS_RX = /\.js$/;
var TEST_RX = /\.test\.js$/;

function formatExtraGroups (groups) {
  var keys = Object.keys(groups);
  return keys.map(function (key) {
    var tester = groups[key];
    if (tester.test) return [key, tester];
    if (typeof tester === 'function') return [key, { test: tester }];
    throw new Error('The given extra group has a mutant tester, key: ' + key);
  });
}

module.exports = function gitFiles (options) {
  options = options || {};

  var files = execSync('git ls-files', {
    encoding: 'utf8',
    cwd: options && options.cwd
  })
    .split('\n')
    .slice(0, -1);

  var optGroups = options.groups || {};

  if (!optGroups.js) optGroups.js = JS_RX;
  if (!optGroups.test) optGroups.test = TEST_RX;
  var groups = formatExtraGroups(optGroups);
  var memo = groups.reduce(function (memo, group) {
    memo[group[0]] = [];
    return memo;
  }, {});

  var result = files.reduce(function (sum, file) {
    groups.forEach(function (group) {
      if (!group[1].test(file)) return;
      sum[group[0]].push(file);
    });

    return sum;
  }, memo);

  result.all = files;

  return result;
};
