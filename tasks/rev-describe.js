/*
 * grunt-rev-describe
 * https://github.com/jkronz/grunt-rev-describe
 *
 * Copyright (c) 2013 Justin Kronz
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
	var CWD = "cwd";
	var SHA_PROP = "sha";
	var TAG_PROP = "tag";
	var DATE_PROP = "date";
  var FAIL_ON_ERROR = "failOnError";
	var DIRTY_MARK = "dirtyMark";

	grunt.registerMultiTask("rev-describe", "Describe current git revision", function (prop, cwd) {

		var done = this.async();

		// Default opts
		var options = {};
		options[CWD] = ".";
		options[FAIL_ON_ERROR] = true;

		// Load cli options (with defaults)
		options = this.options(options);

		// Override options
		options[SHA_PROP] = prop || options[SHA_PROP];
		options[TAG_PROP] = prop || options[TAG_PROP];
		options[DATE_PROP] = prop || options[DATE_PROP];
		options[CWD] = cwd || options[CWD];

		// Log flags (if verbose)
		grunt.log.verbose.writeflags(options);

		// Spawn git
		grunt.util.spawn({
			"cmd" : "git",
			"args" : ['describe', '--tags'],
			"opts" : {
				"cwd" : options[CWD]
			}
		}, function (err, tags) {
			// If an error occurred...
			if (err) {
				// ... and we consider this case fatal
				if ( options[FAIL_ON_ERROR] ) {
					// Log the problem and tell grunt to stop
					done(false);
					grunt.fail.warn(err);
				} else {
          // Log the problem and let grunt continue
					grunt.log.error(err, tags);
					done();
				}
				return;
			}
      grunt.util.spawn({
        "cmd" : "git",
        "args" : ['show', '--pretty=%h%n%cd'],
        "opts" : {
          "cwd" : options[CWD]
        }
      }, function(errb, show) {
        // If an error occurred...
        if (err) {
          // ... and we consider this case fatal
          if ( options[FAIL_ON_ERROR] ) {
            // Log the problem and tell grunt to stop
            done(false);
            grunt.fail.warn(err);
          } else {
            // Log the problem and let grunt continue
            grunt.log.error(err, show);
            done();
          }
          return;
        }
        tags = String(tags);
        show = String(show);
        var shows = show.split("\n");
        var hash = shows[0];
        var date = shows[1];
        grunt.log.ok(tags);
        grunt.log.ok(hash);
        grunt.log.ok(date);
        if (options[SHA_PROP]) {
          grunt.config(options[SHA_PROP], hash);
        }
        if (options[TAG_PROP]) {
          grunt.config(options[TAG_PROP], tags);
        }
        if (options[DATE_PROP]) {
          grunt.config(options[DATE_PROP], date);
        }
        done();
      });
    });
  });
};