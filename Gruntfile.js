module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  const TEST_FILES = ['./src/*.test.js'];
  const ALL_FILES = ['./src/*.js'];

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: ['test/test-common.js']
        },
        src: TEST_FILES
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

  grunt.registerTask('default', ['jshint', 'jscs', 'mochaTest']);
  grunt.registerTask('test', 'default');
};
