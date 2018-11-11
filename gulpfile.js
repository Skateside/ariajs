var gulp            = require("gulp");
var mochaPhantomJS  = require("gulp-mocha-phantomjs");
var concat          = require("gulp-concat-util");
var minify          = require("gulp-minify");
var sourcemaps      = require("gulp-sourcemaps");
var fs              = require("fs");
var pkgJson         = JSON.parse(fs.readFileSync("./package.json"))

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

    var src = [
        "./src/util.js",
        "./src/ARIA.js",
        "./src/ARIA.normalise.js",
        "./src/ARIA.createClass.js",
        "./src/ARIA-dom.js",
        "./src/ARIA.warn.js",
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
    ];
    var extension = [
        "./plugins/src/aria.extendNode.js"
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

gulp.task("watch", [
    "js:watch",
    "plugins:watch",
    // "test:watch"
]);
