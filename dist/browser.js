(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Metisa {
  constructor(opts) {
    this.opts = opts;
    console.log(`initialised Metisa with ${JSON.stringify(opts)}!`);
  }
};
module.exports = Metisa;

},{}],2:[function(require,module,exports){
const MetisaCore = require('./core');

class MetisaDom extends MetisaCore {
  constructor(opts) {
    super(opts);
    console.log('initialsed Metisa Dom with', this);
  }
}

module.exports = MetisaDom;

},{"./core":1}],3:[function(require,module,exports){
const MetisaDom = require('./Metisa/dom');
const util = require('./util');

module.exports = (function() {
  if (util.environment !== 'browser' ) { return console.warn('Metisa browser can only run inside a browser'); }
  window.Metisa = new MetisaDom();
})();

},{"./Metisa/dom":2,"./util":4}],4:[function(require,module,exports){
module.exports = (function() {
  return {
    environment: typeof window === 'object' ? 'browser' : 'node',
  };
})();

},{}]},{},[3]);
