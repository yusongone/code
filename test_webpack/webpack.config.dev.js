var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/main.js'
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
    {
      test: /\.less$/,
      loader: 'style!css!less'
    },
    {
      test: /\.css$/,
      loader: 'style!css'
    },
    {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }
  ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist', //http://localhost:8080/dist 是根目录
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './',
    hot: false,
    proxy: {
     '/apis/*': {
       target: 'http://localhost:8080/src/mock/',
       secure: false
     }
   },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
