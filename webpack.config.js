const path = require('path');
const nodeExternals = require("webpack-node-externals");

module.exports = {
    name: 'deployment',
    mode: 'production',
    entry: './app.ts',
    target: 'node',
    externals: [
      nodeExternals()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};