const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    login: './static/scripts/login.js',
    register: './static/scripts/register.js'
  },
  output: {
    path: path.resolve(__dirname, 'static', 'bundles'),
    filename: '[name].bundle.js',
  },
};