const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    solarSystem: './src/solarSystem.ts',
    menu: './src/menu.ts',
    fransLab: './src/Particles-FransLaboratory.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'three': path.resolve('./node_modules/three')
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      chunks: ['menu'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      filename: 'SolarSystem.html',
      template: 'public/SolarSystem.html',
      chunks: ['solarSystem'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      filename: 'FransLaboratory.html',
      template: 'public/FransLaboratory.html',
      chunks: ['fransLab'],
      inject: 'body',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/assets', to: 'assets' },
        { from: 'public/css', to: 'css' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
};