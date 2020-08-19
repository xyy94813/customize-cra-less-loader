/* eslint-disable */
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/customize-cra-less-loader.production');
} else {
  module.exports = require('./dist/customize-cra-less-loader.development');
}
