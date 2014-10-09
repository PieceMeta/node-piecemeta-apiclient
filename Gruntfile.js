module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        gluejs: {
            client_web: {
                options: {
                    export: 'PMApi',
                    main: 'src/web-piecemeta-apiclient.js'
                },
                src: ['src/web-piecemeta-apiclient.js', 'src/apiclient.js', 'src/http/xmlhttp.js', 'src/util/data-parser.js', 'src/util/auth-header.js'],
                dest: 'dist/piecemeta-apiclient.web.js'
            }
        },
        uglify: {
            client_web: {
                options: {
                    compress: {
                        drop_console: true
                    },
                    banner: '/*! <%= pkg.name %> browser version - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'dist/piecemeta-apiclient.web.min.js': [
                        'dist/piecemeta-apiclient.web.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-glue-js');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['gluejs', 'uglify']);

};