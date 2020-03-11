const path = require('path');
const cleanwebpackplugin = require('clean-webpack-plugin');
const pathConfig = require('./config.js');
const dir = path.resolve(__dirname, '../');
const outPath = path.resolve(dir, pathConfig.output || 'dist');
const entryPath = path.resolve(dir, pathConfig.entry || 'src/index.js');

const pro = {
    mode: 'production',
    externals: 'react',
    entry: {
        index: entryPath
    },
    output: {
        filename: 'index.js',
        path: outPath,
        library: 'easy_drawing',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ["@babel/plugin-transform-runtime", { "corjs": 2 }],
                        "@babel/plugin-syntax-dynamic-import",
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        "@babel/plugin-proposal-class-properties",
                    ]
                }
            }
        ]
    },
    plugins: [
        new cleanwebpackplugin({
            verbose: true,
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true,
            cleanOnceBeforeBuildPatterns: [path.resolve(outPath, '**/*')]
        })
    ]
}

module.exports = pro
