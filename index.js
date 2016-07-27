// Set up global variables
var PRODUCTION = process.env.NODE_ENV === 'production';
global.__SERVER__ = true;
global.__CLIENT__ = false;
global.__DEVELOPMENT__ = !PRODUCTION;
global.__DEVTOOLS__ = false;

if (PRODUCTION) {
  require('./lib/server');
} else {
  // Support ES6
  require('babel-core/register');

  // Just simply link to src/server
  require('./src/server');
}
