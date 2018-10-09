const gulp              = require("gulp");
const mochaPhantomJS    = require("gulp-mocha-phantomjs");
const concat            = require("gulp-concat-util");
const minify            = require("gulp-minify");
const sourcemaps        = require("gulp-sourcemaps");
const fs                = require("fs");
const pkgJson           = JSON.parse(fs.readFileSync("./package.json"))

const getToday = function () {

    let date = new Date();

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

};

gulp.task("js", function () {

    gulp.src([
            "src/ARIA-start.js",
            "src/ARIA.Property.js",
            "src/ARIA.State.js",
            "src/ARIA.UndefinedState.js",
            "src/ARIA.Tristate.js",
            "src/ARIA.List.js",
            "src/ARIA.Reference.js",
            "src/ARIA.ReferenceList.js",
            "src/ARIA.Element.js",
            "src/ARIA-end.js"
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
            `${getToday()} */\n` +
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

gulp.task("test", function () {

    gulp.src("./tests/testrunner.html")
        .pipe(mochaPhantomJS({
            globals: ["window", "ARIA"],
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("watch", function () {

    // gulp.watch(["./tests/**/*.js"], ["test"]);
    gulp.watch(["./src/**/*.js"], ["js"]);

});
