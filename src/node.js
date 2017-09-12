const Metisa = require('./metisa');

// NOTE singleton that gets initialised once, and reused throughout the app life.
module.exports = function(opts = {}) {
  module.exports = new Metisa(opts);
  return module.exports;
};
