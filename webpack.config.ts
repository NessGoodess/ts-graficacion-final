const path = require('path');
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
    new CopyPlugin({
      patterns: [
        { from: 'index.html', to: 'index.html' },
        { from: 'public/assets', to: 'assets' },
        { from: 'public/css', to: 'css' },
        { from: 'public/SolarSystem.html', to: 'SolarSystem.html' },
        { from: 'public/FransLaboratory.html', to: 'FransLaboratory.html' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '.'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
};