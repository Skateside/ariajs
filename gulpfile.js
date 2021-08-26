var gulp            = require("gulp");
var mochaPhantomJS  = require("gulp-mocha-phantomjs");
var concat          = require("gulp-concat");
var replace         = require("gulp-string-replace");
var header          = require("gulp-header");
var footer          = require("gulp-footer");
var minify          = require("gulp-minify");
var fs              = require("fs");
var pkgJson         = JSON.parse(fs.readFileSync("./package.json"));
var colors          = require('ansi-colors');
var supportsColor   = require('color-support');

// Taken from ./node_modules/gulp-cli/lib/shared/ansi.js
var hasColors = colorize();
var ansi = {
    red: hasColors ? colors.red : noColor,
    green: hasColors ? colors.green : noColor,
    blue: hasColors ? colors.blue : noColor,
    magenta: hasColors ? colors.magenta : noColor,
    cyan: hasColors ? colors.cyan : noColor,
    white: hasColors ? colors.white : noColor,
    gray: hasColors ? colors.gray : noColor,
    bgred: hasColors ? colors.bgred : noColor,
    bold: hasColors ? colors.bold : noColor,
    yellow: hasColors ? colors.yellow : noColor,
};
function noColor(message) {
    return message;
}
function hasFlag(flag) {
    return (process.argv.indexOf('--' + flag) !== -1);
}
function colorize() {

    if (hasFlag('no-color')) {
        return false;
    }

    /* istanbul ignore if */
    if (hasFlag('color')) {
        return true;
    }

    return supportsColor();

}

/**
 * Reads the arguments passed to a gulp task.
 *
 * @param  {Array} args
 *         The results of process.argv
 * @return {Object}
 *         Arguments passed to the gulp task.
 */
var readArgs = function (args) {

    var read = {};
    var i = 3;
    var il = args.length;
    var arg;
    var prop;
    var value;

    while (i < il) {

        arg = args[i];

        if (arg.indexOf("--") === 0) {

            prop = arg.slice(2);
            value = true;

        } else {
            value = arg;
        }

        read[prop] = value;
        i += 1;

    }

    return read;

};

/**
 * Gets today's date as a string.
 *
 * @return {String}
 *         Date in the format "YYYY-MM-DD".
 */
var getToday = function () {

    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (String(month).length === 1) {
        month = "0" + month;
    }

    if (String(day).length === 1) {
        day = "0" + day;
    }

    return `${date.getFullYear()}-${month}-${day}`;

};

gulp.task("js", function () {

    return gulp.src([
            "./simple/util.js",
            "./simple/Aria.js",
            "./simple/types.js",
            "./simple/setup.js"
        ])
        .pipe(concat("aria.js"))
        .pipe(replace(/<%=\s*(\w+)\s*%>/g, function (ignore, k) {

            return (
                typeof pkgJson[k] === "string"
                ? pkgJson[k]
                : k
            );

        }))
        .pipe(header(
            [
                "/*! <%= pkgJson.name %> - ",
                "v<%= pkgJson.version %> - <%= pkgJson.license %> license - ",
                "<%= pkgJson.homepage %> - <%= today %> */\n",
                "(function (globalVariable) {\n",
                "    \"use strict\";\n\n"
            ].join(""),
            {
                pkgJson: pkgJson,
                today: getToday()
            }
        ))
        .pipe(footer("}(window));"))
        .pipe(gulp.dest("./dist/"))
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(gulp.dest("./dist/"));

});

gulp.task("js:watch", function () {
    return gulp.watch(["./simple/*.js"], gulp.series("js"));
});

gulp.task("plugins", function () {

    return gulp.src("./simple/plugins/**/*.js")
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(gulp.dest("./dist/plugins/"));

});

gulp.task("plugins:watch", function () {
    return gulp.watch(["./simple/plugins/**/*.js"], gulp.series("plugins"));
});

gulp.task("plugins:list", function (done) {

    fs.readdir("./simple/plugins/", function (error, files) {

        console.log("\nAvailable plugins:");

        files.forEach(function (file) {
            console.log("- " + ansi.blue(file.replace(/\.js$/, "")));
        });

        console.log("\n");
        done();

    });

});

gulp.task("test", function () {

    return gulp.src("./tests/testrunner.html")
        .pipe(mochaPhantomJS({
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("test:plugins", function () {

    return gulp.src("./tests/plugins.html")
        .pipe(mochaPhantomJS({
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("test:watch", function () {
    return gulp.watch(["./tests/*.js"], gulp.series("test"));
});

gulp.task("test:plugins:watch", function () {
    return gulp.watch(["./tests/plugins/*.js"], gulp.series("test:plugins"));
});

gulp.task("full", gulp.series(
    gulp.series("js", "test"),
    gulp.series("plugins", "test:plugins"),
));

gulp.task("watch", gulp.parallel("js:watch", "plugins:watch"));

gulp.task("watch:test", gulp.parallel(
    gulp.series("js:watch", "test:watch"),
    gulp.series("plugins:watch", "test:plugins:watch")
));

gulp.task("custom", function () {

    var args = readArgs(process.argv);
    var plugins = (args.p || args.plugins || "").trim().split(/\s+/);
    var files = [
        "./dist/aria.js"
    ];
    var simpleFileNames = [];

    if (plugins.length === 1 && plugins[0] === "all") {

        plugins = [];
        fs.readdirSync("./simple/plugins/").forEach(function (file) {
            plugins.push(file.replace(/\.js$/, ""));
        });

    }

    plugins.forEach(function (name) {

        var fileName = "./simple/plugins/" + name + ".js";

        if (fs.existsSync(fileName)) {
            files.push(fileName);
        } else {
            console.log("\nWARNING: Unable to find '" + name + "' plugin\n");
        }

    });

    simpleFileNames = files.map(function (fileName) {

        return fileName
            .slice(fileName.lastIndexOf("/") + 1)
            .replace(/\.js$/, "");

    });

    return gulp.src(files)
        .pipe(header(
            "/*! " + simpleFileNames.join(", ") + " */\n"
        ))
        .pipe(concat("aria.custom.js"))
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(gulp.dest("./dist/"));

});

gulp.task("build", gulp.series("js", "custom"));
