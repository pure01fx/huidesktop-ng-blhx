const process = require('process')
const path = require('path')
const webpack = require('webpack')

const conf = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/files')
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'awesome-typescript-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({ PIXI: 'pixi.js' })
  ],
  devtool: 'inline-source-map'
}

console.log(process.env.BUILD_LEVEL)
if (process.env.BUILD_LEVEL === 'development') conf.devtool = 'inline-source-map'

module.exports = conf
