var FILES = require('./src')();

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    mocha_istanbul:{
      coveralls: {
        src: FILES.test,
        options: {
          coverage: true,
          excludes: FILES.test,
          root: './src'
        }
      }
    },

    jshint: {
      default: {
        options: {
          jshintrc: true,
        },
        src: FILES.js
      }
    },

    jscs: {
      src: FILES.js
    }
  });

  grunt.registerTask('default', ['jshint', 'jscs', 'mocha_istanbul']);
  grunt.registerTask('test', 'default');
};
