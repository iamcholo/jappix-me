/*
 * Jappix Me
 * Test tasks (uses GruntJS)
 *
 * Copyright 2014, FrenchTouch Web Agency
 * Author: Valérian Saliou <valerian@valeriansaliou.name>
 */


module.exports = function(grunt) {


  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    // Task: CSSLint
    csslint: {
      all: {
        options: {
          /* 
           * CSS Lint Options
           * Reference: https://github.com/gruntjs/grunt-contrib-csslint/blob/master/README.md#options
           */

          'important': false,
          'duplicate-background-images': false,
          'star-property-hack': false,
          'adjoining-classes': false,
          'box-model': false,
          'qualified-headings': false,
          'unique-headings': false,
          'floats': false,
          'font-sizes': false,
          'ids': false,
          'overqualified-elements': false,
          'known-properties': false,
          'unqualified-attributes': false,
          'universal-selector': false
        },

        src: [
          '../css/*.css'
        ]
      }
    },


    // Task: JSHint
    jshint: {
      files: ['../js/*.js']
    },


    // Task PHPLint
    phplint: {
      all: [
        '../index.php',
        '../php/*.php'
      ]
    }
  });


  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-phplint');


  // Map tasks
  var GRUNT_TASKS_TEST = {
    all: [['lint',0]]
  };

  var GRUNT_TASKS_LINT = {
    css: [['csslint',0]],
    js: [['jshint',0]],
    php: [['phplint',0]]
  };


  // Register tasks
  grunt.registerTask('default', function() {
    return grunt.warn('Usage:' + '\n\n' + 'test - grunt test' + '\n\n');
  });

  grunt.registerTask('test', function() {
    for(t in GRUNT_TASKS_TEST) {
      for(i in GRUNT_TASKS_TEST[t]) {
        grunt.task.run(GRUNT_TASKS_TEST[t][i][0] + (GRUNT_TASKS_TEST[t][i][1] ? (':' + t) : ''));
      }
    }
  });

  grunt.registerTask('lint', function(t) {
    var lint_t_all = [];

    if(t == null) {
      for(t in GRUNT_TASKS_LINT) {
        lint_t_all.push(t);
      }
    } else if(typeof GRUNT_TASKS_LINT[t] != 'object') {
      return grunt.warn('Invalid lint target name.\n');
    } else {
      lint_t_all.push(t);
    }

    for(c in lint_t_all) {
      t = lint_t_all[c];

      for(i in GRUNT_TASKS_LINT[t]) {
        grunt.task.run(GRUNT_TASKS_LINT[t][i][0] + (GRUNT_TASKS_LINT[t][i][1] ? (':' + t) : ''));
      }
    }
  });

};