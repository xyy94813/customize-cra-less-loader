/* eslint-disable */
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/next-with-polyfill.production');
} else {
  module.exports = require('./lib/next-with-polyfill.development');
}
