module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
        js: {
            src: ["frontend/src/js/**/*.js"],
            dest: "frontend/build.js"
        }
    },

    babel: {
        options: {
            presets: ['es2015']
        },

        js: {
            files: {
                "frontend/build.js": "frontend/build.js"
            }
        }
    },

    uglify: {
        js: {
            files: {
                "frontend/build.js": "frontend/build.js"
            }
        }
    },

    sass: {
        options: {
            sourceMap: false,
            outputStyle: "compressed"
        },

        css: {
            files: {
                "frontend/buildJS.css": "frontend/src/css/.settings.js.sass",
                "frontend/buildNoJS.css": "frontend/src/css/.settings.nojs.sass"
            }
        }
    },

    watch: {
        options: {
            spawn: false
        },

        js: {
            files: ['frontend/src/js/**/*.js'],
            tasks: ['concat', "babel", "uglify"]
        },

        css: {
            files: ['frontend/src/css/*.scss', 'frontend/src/css/.settings.*.sass'],
            tasks: ['sass']
        }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', "babel", "uglify", "sass"]);

};
