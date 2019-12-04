let path = require("path");
let WebpackAutoInject = require("webpack-auto-inject-version");

let config = {
    mode: "production",
    entry: {
        aria: "./rewrite/setup.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: [
        new WebpackAutoInject({
            components: {
                AutoIncreaseVersion: false
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /rewrite/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", {
                                useBuiltIns: "usage",
                                corejs: 3
                            }]
                        ],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname + "/rewrite"),
            "~j": path.resolve(__dirname + "/jest")
        }
    }
};

module.exports = (env, argv) => {

    if (argv.mode === "development") {

        config.mode = "development";
        config.devtool = "source-map";
        config.entry.jest = "./jest/jest.js";

    }

    return config;

};
