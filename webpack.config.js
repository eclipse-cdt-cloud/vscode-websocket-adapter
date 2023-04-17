//@ts-check
'use strict';

const path = require('path');
const webpack = require('webpack');

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const common = {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        vscode: 'commonjs vscode'
    }
};

/** @type WebpackConfig[] */
module.exports = [
    {
        ...common,
        target: 'node',
        entry: {
            extension: './src/desktop/extension.ts'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs'
        },
        plugins: [
            new webpack.ProvidePlugin({
                WebSocket: ['ws', 'WebSocket']
            })
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        }
    },
    {
        ...common,
        target: 'webworker',
        entry: {
            'web-extension': './src/browser/extension.ts'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs'
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            fallback: {
                net: false
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer']
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser'
            })
        ]
    }
];
