const path = require('path');
const nodeExternals = require("webpack-node-externals");

module.exports = {
    name: 'deployment',
    mode: 'production',
    entry: './server.ts',
    target: 'node',
    externals: [
        nodeExternals()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /(node_modules|coverage|__tests__|.spec$)/
            }
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