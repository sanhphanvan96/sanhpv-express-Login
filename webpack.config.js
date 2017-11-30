const path = require("path");

module.exports = {
    entry: [
        path.resolve(__dirname, "src/client", "root.js")
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};