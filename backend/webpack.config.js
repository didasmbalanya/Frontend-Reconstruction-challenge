/* eslint-disable @typescript-eslint/no-var-requires */
require('events').EventEmitter.defaultMaxListeners = 30;
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerWebpackPluginLimiter = require('fork-ts-checker-webpack-plugin-limiter');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isLocal = slsw.lib.webpack.isLocal;

const isDev = slsw.lib.options.stage === 'dev' || isLocal;
const { map, get, find } = require('lodash');

const convertPattern = (s) => {
    if (s.endsWith('*')) return s;
    if (!s.includes('/')) return s;

    const i = s.lastIndexOf('/');
    return { from: s, to: s.substring(0, i) + '/' };
};

//https://github.com/serverless-heaven/serverless-webpack/issues/425#issuecomment-689101901
const IncludeFilesPlugin = {
    apply: (compiler) => {
        const handler = `${Object.keys(compiler.options.entry)[0]}.handler`;
        const config = find(slsw.lib.serverless.service.functions, (val) => val.handler === handler);

        let includePaths = get(config, 'package.include', []);
        includePaths = map(includePaths, convertPattern);
        if (includePaths.length) {
            new CopyWebpackPlugin({ patterns: includePaths }).apply(compiler);
        }
    },
};

module.exports = {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    externals: [nodeExternals(), /aws-sdk/],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    optimization: {
        minimize: !isDev,
    },
    performance: {
        hints: false,
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
    },
    target: 'node',
    module: {
        rules: [
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, '.serverless'),
                    path.resolve(__dirname, '.webpack'),
                    /__tests__/,
                    /__mocks__/,
                ],
                use: [
                    // { loader: 'ts-loader', options: { onlyCompileBundledFiles: true } },
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve('.webpackCache'),
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: { plugins: ['@babel/plugin-proposal-class-properties'] },
                    },
                ],
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            },
            {
                test: /\.graphql$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'graphql-tag/loader',
            },
        ],
    },
    plugins: [IncludeFilesPlugin, new ForkTsCheckerWebpackPlugin()],
};
