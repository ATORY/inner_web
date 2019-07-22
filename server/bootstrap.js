require('ignore-styles')
require('url-loader')
require('file-loader')
require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    'dynamic-import-node',
    'react-loadable/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
  ],
})
require('./index')
