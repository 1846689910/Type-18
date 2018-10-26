/**
 *  reference: https://github.com/jantimon/html-webpack-plugin
 *  根据template.html生成所需的index.html, 并且引用合适的bundle.js
 * */
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * reference: https://github.com/johnagan/clean-webpack-plugin
 * 在build bundle.js时，清理原有的文件
 * */
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require('webpack');
module.exports = {
    entry: [
        "babel-polyfill",
        `${__dirname}/src/index.js`
    ],
    output: {
        path: `${__dirname}/dist`,  // packed file directory
        filename: "bundle.[hash].js"  // name of packed file
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',  // split code in app and node_modules into bundle and vendor.bundle.js
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {  // keep splitting the node_modules chunks
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },{
                test: /\.html$/,
                use: [{
                    loader: "underscore-template-loader",
                    options: { minimize: true }
                }]
            },{
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },{
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: "url-loader?limit=100000",  // 文件大小超过 100000 bytes, 会自动使用file-loader
                    // loader: 'file-loader',  // 如果项目中对路径要求严格，此处也可用file-loader来显式地将文件添加至dist中
                    options: {
                        emitFile: true,
                        name: './images/[name].[ext]', // 这个相对路径是基于`${__dirname}/dist/...`
                    }
                }]
            },{
                test: /\.(woff|woff2|eot|ttf|svg)(\?v=.*)?$/,
                use: [{
                    loader: 'url-loader?limit=100000',
                    // loader: "file-loader",
                    options: {
                        name: `./fonts/[name].[ext]`
                    }
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([  // the path(s) that should be cleaned
            "dist/*.*"
        ], {  // the clean options to use
            root: `${__dirname}`,
            exclude: [],
            verbose: false
        }),
        new HtmlWebpackPlugin({
            title: "Webpack Test",
            template: "./template/template.html",
            filename: "./index.html"
        }),
        new webpack.HashedModuleIdsPlugin()
    ]
};
