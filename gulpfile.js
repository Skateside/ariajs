var gulp            = require("gulp");
var mochaPhantomJS  = require("gulp-mocha-phantomjs");
var concat          = require("gulp-concat-util");
var minify          = require("gulp-minify");
var sourcemaps      = require("gulp-sourcemaps");
var fs              = require("fs");
var pkgJson         = JSON.parse(fs.readFileSync("./package.json"))
var pluginMeta      = JSON.parse(fs.readFileSync("./plugins.json"));

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
            "./src/util.js",
            "./src/ARIA.js",
            "./src/ARIA-prefix.js",
            "./src/ARIA.createClass.js",
            "./src/ARIA-dom.js",
            "./src/ARIA.Observer.js",
            "./src/ARIA.Property.js",
            "./src/ARIA.Number.js",
            "./src/ARIA.Integer.js",
            "./src/ARIA.State.js",
            "./src/ARIA.UndefinedState.js",
            "./src/ARIA.Tristate.js",
            "./src/ARIA.List.js",
            "./src/ARIA.Reference.js",
            "./src/ARIA.ReferenceList.js",
            "./src/ARIA.Element.js",
            "./src/ARIA-factories.js"
        ])
        .pipe(concat("aria.js", {
            process: function (source) {

                return (
                    source
                        .replace(/<%=\s*(\w+)\s*%>/g, function (ignore, k) {

                            return (
                                typeof pkgJson[k] === "string"
                                ? pkgJson[k]
                                : k
                            );

                        })
                );

            }
        }))
        .pipe(concat.header(
            `/*! ${pkgJson.name} - ` +
            `v${pkgJson.version} - ${pkgJson.license} license - ` +
            `${pkgJson.homepage} - ${getToday()} */\n` +
            `(function (globalVariable) {\n` +
            `    "use strict";\n\n`

        ))
        .pipe(concat.footer('}(window));'))
        .pipe(gulp.dest("./dist/"))
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(sourcemaps.write("./", {
            sourceMappingURL: function (file) {
                return file.relative + ".map";
            }
        }))
        .pipe(gulp.dest("./dist/"));

});

gulp.task("js:watch", function () {
    gulp.watch(["./src/**/*.js"], ["js"]);
});

gulp.task("plugins", function () {

    gulp.src("./plugins/src/*.js")
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(sourcemaps.write("./", {
            sourceMappingURL: function (file) {
                return file.relative + ".map";
            }
        }))
        .pipe(gulp.dest("./plugins/dist/"));

});

gulp.task("plugins:watch", function () {
    gulp.watch(["./plugins/src/*.js"], ["plugins"]);
});

gulp.task("test", function () {

    gulp.src("./tests/testrunner.html")
        .pipe(mochaPhantomJS({
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("test:watch", function () {
    gulp.watch(["./tests/**/*.js"], ["test"]);
});

gulp.task("watch", [
    "js:watch",
    "plugins:watch",
    // "test:watch"
]);

gulp.task("build", ["js", "plugins"], function () {

    var args = readArgs(process.argv);
    var plugins = (args.p || args.plugins || "").trim().split(/\s+/);
    var rawRequires = [];
    var requireKeys = {};
    var files = [
        "./dist/aria.js"
    ];

    if (plugins.length === 1 && plugins[0] === "all") {
        plugins = Object.keys(pluginMeta);
    }

    plugins.forEach(function (plugin) {

        var meta = pluginMeta[plugin];

        if (meta) {

            if (meta.requires) {
                rawRequires = [].concat(meta.requires, rawRequires);
            }

            rawRequires.push(plugin);

        } else {
            console.log("\nWARNING: Unable to find '" + plugin + "' plugin\n");
        }

    });

    rawRequires.forEach(function (raw) {
        requireKeys[raw] = true;
    });

    Object.keys(requireKeys).forEach(function (ref) {
        files.push("./plugins/src/aria." + ref + ".js");
    });

    gulp.src(files)
        .pipe(concat.header(
            "/*! " + files.join(", ") + " */\n"
        ))
        .pipe(concat("aria.custom.js"))
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(sourcemaps.write("./", {
            sourceMappingURL: function (file) {
                return file.relative + ".map";
            }
        }))
        .pipe(gulp.dest("./dist/"));

});
