module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  const TEST_FILES = ['./src/*.test.js'];
  const ALL_FILES = ['./src/*.js'];

  grunt.initConfig({
    mocha_istanbul:{
      coveralls: {
        src: TEST_FILES, // multiple folders also works
        options: {
          coverage: true,
          excludes: ['*.test.js'],
          root: './src'
        }
      }
    },
    jshint: {
      default: {
        options: {
          jshintrc: true,
        },
        src: ALL_FILES
      }
    },
    jscs: {
      src: ALL_FILES
    }
  });

  grunt.registerTask('default', ['jshint', 'jscs', 'mocha_istanbul']);
  grunt.registerTask('test', 'default');
};
