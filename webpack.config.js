let path = require("path");

let config = {
    mode: "production",
    entry: {
        aria: "./rewrite/setup.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
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
            "~": path.resolve(__dirname + "/rewrite")
        }
    }
};

module.exports = (env, argv) => {

    if (argv.mode === "development") {

        config.mode = "development";
        config.devtool = "source-map";
        config.entry.jest = "./jest/jest.js";
        config.resolve.alias["~j"] = path.resolve(__dirname + "/jest");

    }

    return config;

};
