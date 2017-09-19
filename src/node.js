const Metisa = require('./metisa');

/**
 * Restricts {@link Metisa} object to be initialised once, and reused throughout the app life.
 *
 * @private
 * @param  {Opts} opts
 * @return {Metisa}
 * @requires Metisa
 */
function singleton(opts = {}) {
  module.exports = new Metisa(opts);
  return module.exports;
}
module.exports = singleton(opts = {});
