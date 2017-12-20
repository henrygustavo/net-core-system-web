var webpack = require("webpack");
var webpackMerge = require("webpack-merge");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var commonConfig = require("./webpack.common.js");
var helpers = require("./helpers");

var ENV = process.env.npm_lifecycle_event;

module.exports = webpackMerge(commonConfig,
    {
        devtool: "cheap-module-source-map",
        output: {
            path: helpers.root("dist"),
            filename: 'js/[name].[hash].js'
        },
        module: {
            rules: [
                {
                    test: /\.(jpg|jpeg|png|gif|svg)(\?.*)?$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[hash].[ext]",
                                outputPath: "images/",
                                publicPath: "../",
                            }
                        }
                    ]
                }, {
                    test: /\.(eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[hash].[ext]",
                                outputPath: "fonts/",
                                publicPath: "../"
                            }
                        }
                    ]
                }
            ]  
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),

            new ExtractTextPlugin("css/[name].[hash].css"),
            new webpack.DefinePlugin({
                'process.env': {
                    'ENV': JSON.stringify(ENV)
                }
            }),
            new webpack.LoaderOptionsPlugin({
                htmlLoader: {
                    minimize: true
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourcemap: true,
                beautify: false,
                comments: false,
                compress: {
                    warnings: false,
                    drop_console: true
                }
            }),
        ]
    });