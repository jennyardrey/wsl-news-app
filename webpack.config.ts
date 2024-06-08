const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry file of your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Output bundle file
  },
  module: {
    rules: [
      {
        test: /\.scss$/, // Match Sass files
        use: [
          'style-loader', // Inject styles into DOM
          {
            loader: 'css-loader', // CSS loader with CSS modules
            options: {
              modules: true, // Enable CSS modules
            },
          },
          'sass-loader', // Compile Sass to CSS
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};