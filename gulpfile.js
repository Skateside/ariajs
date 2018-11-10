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

    var src = [
        // "src/ARIA-start.js",
        "src/util.js",
        "src/ARIA.js",
        "src/ARIA.normalise.js",
        "src/ARIA.createClass.js",
        "src/ARIA-dom.js",
        "src/ARIA-focus.js",
        "src/ARIA.warn.js",
        "src/ARIA.Property.js",
        "src/ARIA.Number.js",
        "src/ARIA.Integer.js",
        "src/ARIA.State.js",
        "src/ARIA.UndefinedState.js",
        "src/ARIA.Tristate.js",
        "src/ARIA.List.js",
        "src/ARIA.Reference.js",
        "src/ARIA.ReferenceList.js",
        "src/ARIA.Element.js",
        // "src/ARIA-end.js"
        "src/ARIA-factories.js"
    ];
    var extension = [
        "src/Element.js"
    ];

    function createAriaJS(src, fileName) {

        return gulp.src(src)
            .pipe(concat(fileName, {
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

    }

    createAriaJS(src, "aria.noExtend.js");
    createAriaJS(src.concat(extension), "aria.js");

});

gulp.task("js:watch", function () {
    gulp.watch(["./src/**/*.js"], ["js"]);
});

gulp.task("test", function () {

    gulp.src("./tests/testrunner.html")
        .pipe(mochaPhantomJS({
            // globals: ["window", "ARIA", "makeUniqueId"],
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("test:watch", function () {
    gulp.watch(["./tests/**/*.js"], ["test"]);
});

// gulp.task("watch", function () {
//
//
// });
