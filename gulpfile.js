var gulp            = require("gulp");
var mochaPhantomJS  = require("gulp-mocha-phantomjs");
var concat          = require("gulp-concat-util");
var minify          = require("gulp-minify");
var sourcemaps      = require("gulp-sourcemaps");
// var jest            = require("gulp-jest").default;
var fs              = require("fs");
var pkgJson         = JSON.parse(fs.readFileSync("./package.json"))
// var pluginMeta      = JSON.parse(fs.readFileSync("./plugins.json"));

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
            "./simple/types.js",
            "./simple/Aria.js",
            "./simple/setup.js"
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
    gulp.watch(["./simple/**/*.js"], ["js"]);
});

// gulp.task("jest", function () {
//
//     return gulp.src("./jest/**/*.js")
//         .pipe(jest({
//             clearMocks: true,
//             coverageDirectory: "coverage",
//             // testMatch: [
//             //     // "**/jest/**/*.js"
//             //     "**/dist/jest.js"
//             //     //   "**/__tests__/**/*.[jt]s?(x)",
//             //     //   "**/?(*.)+(spec|test).[tj]s?(x)"
//             // ],
//         }));
//
// });

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

gulp.task("watch", gulp.parallel(
    "js:watch",
    // "test:watch"
));
