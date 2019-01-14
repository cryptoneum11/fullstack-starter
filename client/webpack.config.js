const PugPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/js/index.js',
  output: {
    path: __dirname + '/../server/dist',
    filename: './js/[name].js'
  },
  mode: 'development',
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['html-loader?attrs=false', 'pug-html-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new PugPlugin({
      filename: './index.html',
      template: './src/index.pug',
      inject: false
    })
  ]
};
