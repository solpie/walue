var nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
    entry: {
        "main": "./src/main.ts",//electron default entry index.js if no package.json
        "Server": "./src/Server.ts"
    },
    target: "electron",
    externals: [nodeExternals()],
    output: {
        path: './resources/app',
        filename: "[name].js"
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js"]
    },
    devtool: 'source-map',
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ],
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.tsx?$/, exclude: [/node_modules/], loader: 'ts-loader'}
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: 'src/',
                from: 'view/**/*.ejs'
            },
            {
                context: 'src/static/',
                from: '**/*', to: 'static/'
            },
            {from: 'src/package.json'},
            {from: 'src/reload.html'}
        ])
    ]
};