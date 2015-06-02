/* jslint node: true */
module.exports = function(grunt) {
	"use strict";

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Configuration
	var config = {
		source: 'src',
		temp: '.temp',
		dist: 'dist'
	};

	grunt.initConfig({

		// Project settings
		config: config,

		watch: {
			css: {
				files: ["<%= config.source %>/styles/*.scss"],
				tasks: ['updatestyles'],
				options: {
					livereload: {
						port: 9099
					}
				}
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: [{
					expand: true,
					cwd: '<%= config.source %>/styles',
					src: ['*.scss'],
					dest: '<%= config.temp %>/styles',
					ext: '.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 5 versions']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/styles/',
					src: 'bundle.css',
					dest: '<%= config.temp %>/styles/'
				}]
			}
		},

		// Copy remaining files so other tasks can use
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.source %>/',
						dest: '<%= config.dist %>/',
						src: [
							'**/*.html'
						]
					}
				]
			},
			tmp: {
				files: [
					{
						expand: true,
						cwd: '<%= config.source %>/',
						dest: '<%= config.temp %>/',
						src: [
							'**/*.html'
						]
					}
				]
			}
		},

		concat: {
			dist: {
				options: {
					separator: ''
				},
				files: [{
					src: ['<%= config.temp %>/styles/*.css'],
					dest: '<%= config.temp %>/styles/bundle.css'
				}]
			}
		},

		cssmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/styles',
					src: ['bundle.css'],
					dest: '<%= config.dist %>/styles',
					ext: '.min.css'
				}]
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			},
			tmp: {
				files: [{
					dot: true,
					src: [
						'<%= config.temp %>'
					]
				}]
			},
			styles: {
				files: [{
					dot: true,
					src: [
						'<%= config.temp %>/styles/*',
						'<%= config.dist %>/styles/*'
					]
				}]
			}
		},

		scsslint: {
			allFiles: [
				'<%= config.source %>/styles/**/*.scss'
			],
			options: {
				config: '.scss-lint.yml',
				colorizeOutput: true
			}
		}

	});

	grunt.registerTask('default', [
		'scsslint',
		'clean:tmp',
		'clean:dist',
		'sass:dist',
		'copy:dist',
		'concat:dist',
		'autoprefixer',
		'cssmin:dist'
	]);

	grunt.registerTask('updatestyles', [
		'clean:styles',
		'sass:dist',
		'concat:dist',
		'cssmin:dist'
	]);

};