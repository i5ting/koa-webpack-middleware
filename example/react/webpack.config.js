const dev = process.env.NODE_ENV !== "production";
const path = require( "path" );
const webpack = require( "webpack" );
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );
const FriendlyErrorsWebpackPlugin = require( "friendly-errors-webpack-plugin" );

const plugins = [
    new FriendlyErrorsWebpackPlugin(),
];

if ( !dev ) {
    plugins.push( new BundleAnalyzerPlugin( {
        analyzerMode: "static",
        reportFilename: "webpack-report.html",
        openAnalyzer: false,
    } ) );
}

module.exports = {
    mode: dev ? "development" : "production",
    context: path.join( __dirname, "src" ),
    devtool: dev ? "none" : "source-map",
    entry: {
        app: [ "./client.js", 'webpack-hot-middleware/client?reload=0'],
    },
    resolve: {
        modules: [
            path.join( __dirname, "src" ),
            "node_modules",
        ],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
        ],
    },
    output: {
        path: path.resolve( __dirname, "dist" ),
        // filename: "[name].bundle.js",
        filename: '[name].[hash].js'
    },
    plugins: [
        // OccurrenceOrderPlugin is needed for webpack 1.x only
        // new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // Use NoErrorsPlugin for webpack 1.x
        // new webpack.NoEmitOnErrorsPlugin()
    ]
};
