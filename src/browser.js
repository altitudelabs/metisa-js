const MetisaDom = require('./Metisa/dom');
const util = require('./util');

module.exports = (function() {
  if (util.environment !== 'browser' ) {
    return console.warn('Metisa browser can only run inside a browser');
  }
  window.jQuery = window.$ = $ || jQuery || {};

  window.Metisa = new MetisaDom();
})();
