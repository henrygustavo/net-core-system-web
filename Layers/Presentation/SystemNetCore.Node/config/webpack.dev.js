var webpackMerge = require("webpack-merge");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var commonConfig = require("./webpack.common.js");
var helpers = require("./helpers");

module.exports = webpackMerge(commonConfig,
    {
        devtool: "cheap-module-eval-source-map",

        output: {
            path: helpers.root("dist"),
            filename: 'assets/js/[name].js'
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
                                outputPath: "assets/images/",
                                publicPath: "/"
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
                                outputPath: "assets/fonts/",
                                publicPath: "/",
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin("assets/css/[name].css")
        ],
        devServer: {
            compress: true,
            port: 9090,
            open: true,
            stats: "errors-only"
        },
    });