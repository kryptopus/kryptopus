const webpack = require("webpack");
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const websiteStyle = new ExtractTextWebpackPlugin("style/website.[chunkhash].css");

let config = {
    mode: "development",
    entry: {
        website: [
            "./static/src/js/website.js",
            "./static/src/style/website.scss"
        ]
    },
    output: {
        path: path.resolve(__dirname, "./static/dist"),
        filename: "js/[name].[chunkhash].js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: websiteStyle.extract(["css-loader", "sass-loader"])
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 1,
                    regExp: /static\/src\/(.*)\/[a-zA-Z0-9_\-\.]+\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    name: "[1]/[name].[hash].[ext]",
                    publicPath: "/"
                }
            }
        ]
    },
    plugins: [
        new CleanPlugin([
            "./static/dist"
        ], {
            verbose: true
        }),
        new CopyPlugin([
            {
                from: "static/src/img/**/*.@(svg|png|gif|jpg)",
                to: "img/[1]/[2].[hash].[ext]",
                test: /static\/src\/img\/(.+)\/(.+)\.(svg|png|gif|jpg)$/
            }
        ]),
        new ManifestPlugin({
            map: (file) => {
                file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, "$2");
                return file;
            },
        }),
        websiteStyle
    ]
};

module.exports = config;
