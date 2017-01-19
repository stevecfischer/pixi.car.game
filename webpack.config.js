module.exports = {
    entry: "./src/game.js",

    output: {
        path: "build",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: "./src",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}