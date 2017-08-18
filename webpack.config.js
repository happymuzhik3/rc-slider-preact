module.exports = {
  entry: './dev-server/index.jsx',
  devtool: 'source-map',
  devServer: {
    contentBase: './dev-server',
    open: true,
    port: 7622
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: ['babel-loader']
      }
    ]
  },
  output: 'bundle.js'
}
