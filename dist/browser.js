(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Options object definition
 * @private
 * @typedef {Object} Opts
 * @property {string} baseUrl=https://askmetisa.com/ Base URL of API
 * @property {string} itemEndpoint=/api/v1/product-collection Path of API endpoint for creating or updating items
 * @property {string} actionEndpoint=/api/v1/order-transaction Path of API endpoint for creating or updating actions
 */

/**
 * @private
 * @class
 * @classdesc Base class for any environment.

 */
class Metisa {
  /**
   * Constructs a new `Metisa` with `opts`.
   * @param {Opts} opts Option object to be passed to Metisa contructor
   */
  constructor(opts) {
    opts = opts || {};
    this.opts = Object.assign(
    {
        baseUrl: 'https://askmetisa.com/',
        itemEndpoint: "/api/v1/product-collection",
        actionEndpoint: "/api/v1/order-transaction",
      },
      opts
    );
    /**
     * Whether to write logs in browser console
     * @type {boolean}
     */
    this.debug = true;
    console.log(`initialised Metisa with ${JSON.stringify(this.opts)}!`);
  }

  /**
   * Returns `true` if it is ready to start calling API.
   * @returns {boolean}
   */
  get isReadyToStart() {
    var isReady = false;
    return true;
  }

  /**
   * Registers options from `mt('{{ option }}', {{ value }})`.
   */
  registerOptions() {
    if (arguments[0] === 'baseUrl') {
      // Init Base URL for testing
      this.log('Base URL is', arguments[1]);
      this.opts.baseUrl = arguments[1]; // override
    } else if (arguments[0] === 'item') {
      // Init Item object
      this.log('Item is', arguments[1]);
      this.item = arguments[1];
    } else if (arguments[0] === 'action') {
      // Init Action object
      this.log('Action is', arguments[1]);
      this.action = arguments[1];
    } else if (arguments[0] === 'slug') {
      // Init store slug
      this.log('Store slug is', arguments[1]);
      this.slug = arguments[1];
    } else if (arguments[0] === 'user') {
      // Init user based recommendations
      this.log('User ID is', arguments[1]);
      this.userId = arguments[1];
    } else if (arguments[0] === 'category') {
      // Init category
      this.log('Category is', arguments[1]);
      this.categoryName = arguments[1];
    } else if (arguments[0] === 'brand') {
      // Init brand
      this.log('Brand is', arguments[1]);
      this.brandname = arguments[1];
    } else if (arguments[0] === 'itemId') {
      // Init item id
      this.log('Item ID is', arguments[1]);
      this.itemId = arguments[1];
    } else if (arguments[0] === 'gender') {
      // Init gender
      this.log('Gender is', arguments[1]);
      this.gender = arguments[1];
    } else if (arguments[0] === 'session') {
      // Init session
      this.log('Session is', arguments[1])
      this.sessionId = arguments[1];
    } else if (arguments[0] === 'language') {
      this.log('Language is', arguments[1])
      this.language = arguments[1];
    }
  }
};
module.exports = Metisa;

},{}],2:[function(require,module,exports){
var MetisaCore = require('../core');
var withIFrame = require('./withIFrame');
var util = require('../../util');
var compose = util.compose;

/**
 * @private
 * @class
 * @classdesc {@link Metisa} class that composes with {@link composeClass.IFrame}
 * @requires Metisa
 * @requires composeClass
 * @requires getUtil.compose
 */
var MetisawithIFrame = compose(MetisaCore)(withIFrame);

/**
 * @private
 * @class
 * @classdesc Base class for browser environment. This is initialised and exposed to `window.Metisa` when you import through our [example](/#installation).
 * @extends MetisawithIFrame
 */
class MetisaDom extends MetisawithIFrame {
  /**
   * Constructs a new `MetisaDom` with `opts`.
   * @param {Opts} opts Option object to be passed to MetisaDom contructor
   */
  constructor(opts) {
    if ($ == null) {
      return console.warn('Metisa Dom requires jQuery to be available!')
    }
    super(opts);

    console.log(`initialised Metisa Dom with ${JSON.stringify(this.opts)}!`);
    this.renderWidget = this.renderWidget.bind(this);
    this.registerOptions = this.registerOptions.bind(this);

    this.attachRegisterOptionsToWindow();
  }

  /**
   * Attaches registered options to `window.mt`.
   */
  attachRegisterOptionsToWindow() {
    window.mt = this.registerOptions;
  }

  /**
   * Registers options from `mt('{{ option }}', {{ value }})`and determines whether item or action data should be handled.
   */
  registerOptions() {
    super.registerOptions.apply(this, arguments);

    if (this.isReadyToStart) {
      this.renderWidget();
      if (this.item) {
        this.track('item', this.item);
      }
      else if(this.action) {
        this.track('action', this.action);
      }
    }
  }

  /**
   * Renders Metisa widgets in the browser.
   */
  renderWidget() {
    var self = this,
      widgets = $('.mt-widget');

    // Convert widgets nodelist to true array
    widgets = $.makeArray(widgets);

    widgets.forEach(function(widget) {
      // Render widget using Ajax so we can gracefully degrade if there is no content available
      var widgetId = widget.dataset.widgetId,
        userId = widget.dataset.userId,
        itemId = widget.dataset.itemId,
        categoryName = widget.dataset.categoryName,
        brandname = widget.dataset.brandname,
        sessionId = widget.dataset.sessionId,
        language = widget.dataset.language,
        url = this.opts.baseUrl + this.slug + '/api/v1/widget-customer?widget_id=' + widgetId;

      // Override user, category or brand
      if (userId) this.userId = userId;
      if (itemId) this.itemId = itemId;
      if (categoryName) this.categoryName = categoryName;
      if (brandname) this.brandname = brandname;
      if (sessionId) this.sessionId = sessionId;
      if (language) this.language = language;

      if (this.userId) {
        url += '&customer_id=' + escape(this.userId);
      }

      if (this.itemId) {
        url += '&product_id=' + escape(this.itemId);
      }

      if (this.categoryName) {
        url += '&category_name=' + escape(this.categoryName);
      }

      if (this.brandname) {
        url += '&brandname=' + escape(this.brandname);
      }

      if (this.gender) {
        url += '&gender=' + escape(this.gender);
      }

      if (this.sessionId) {
        url += '&session_id=' + escape(this.sessionId);
      }

      if (this.language) {
        url += '&language=' + escape(this.language);
      }

      url += '&format=html';
      // Prepare iframe
      var iframe = self.createIFrameWithId(widgetId);

      widget.appendChild(iframe);

      // Render loader
      var html = self.getLoaderHTML();

      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html);
      iframe.contentWindow.document.close();

      $.ajax({
        type: "GET",
        url: url,
      })
      .done(function(data, statusText, xhr) {
        // Delete loader iframe
        var oldIFrame = document.getElementById('widget-' +
        widgetId);

        var iframeParent = oldIFrame.parentNode;

        if (iframeParent) {
          while (iframeParent.firstChild) {
            iframeParent.removeChild(iframeParent.firstChild);
          }
        }

        // Create a new iframe for widget
        var iframe = self.createIFrameWithId(widgetId);
        if (xhr.status === 200) {
          widget.appendChild(iframe);

          var html = self.decodeHtmlEntities(data);

          if (html) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
            iframe.parentNode.style.marginBottom = '30px';
          } else {
            // Html will be empty if store has run out of free sales credits.
            // Gracefully fail to load widget by removing the iframe from DOM.
            iframe.parentNode.removeChild(iframe);
          }
        } else {
          console.log('Error: ' + statusText);
          // Remove iframe from DOM
          iframe.parentNode.removeChild(iframe);
        }
      });
    }.bind(this));
  }
  /**
   * Starts tracking by submitting item or action data to the API.
   * @param {string} cat Category name of data (allowed values: `"item"`,`"action"`)
   * @param {object} data Object of item or action data
   */

  track(cat, data) {
    if (this.slug) {
      if (cat === 'item') {
        this.createOrUpdateItem(data);
      }
      else if (cat === 'action') {
        this.createOrUpdateAction(data);
      }
    }
  }

  /**
   * Creates an item if it does not exist in Metisa or updates the item.
   * @param {Object} itemData [itemData]{@link BROWSER/SCHEMA.html#Item-data} object to be submitted to the item API endpoint
   */
  createOrUpdateItem(data) {
    var url = this.opts.baseUrl + this.slug + this.opts.itemEndpoint;
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      },
      statusCode: {
          500: function(data, statusText, xhr) {
              console.log('Internal server error');
          },
      },
      success: function (data, statusText, xhr) {
          console.log('Success');
      },
      error: function (data, statusText, xhr) {
          console.log('Error: '+xhr);
      }
    });
  }

  /**
   * Creates an action if it does not exist in Metisa or updates the action.
   * @param {Object} actionData [actionData]{@link BROWSER/SCHEMA.html#Action-data} object to be submitted to the action API endpoint
   */
  createOrUpdateAction(data) {
    var url = this.opts.baseUrl + this.slug + this.opts.actionEndpoint;
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data),
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      },
      statusCode: {
          500: function(data, statusText, xhr) {
              console.log('Internal server error');
          },
      },
      success: function (data, statusText, xhr) {
          console.log('Success');
      },
      error: function (data, statusText, xhr) {
          console.log('Error: '+xhr);
      }
    });
  }

  /**
   * Writes logs about registered options to browser console when `debug` property of `MetisaDom` object is `true`
   */
  log() {
    if (this.debug) {
      console.log.apply(window, arguments);
    }
  }
}

module.exports = MetisaDom;

},{"../../util":5,"../core":1,"./withIFrame":3}],3:[function(require,module,exports){
/**
 * Returns {@link composeClass.IFrame} composed with `composedClass`.
 *
 * @private
 * @param  {class} composedClass `composedClass` to be composed.
 * @returns {composeClass.IFrame}
 */

var composeClass = function(composedClass) {
  /**
   * `<iframe>` element in the recommendation widget.
   * @typedef {Object} IFrame
   * @memberof composeClass
   */
  return class IFrame extends composedClass {
    /**
     * Returns `iframe` element
     * @memberof composeClass.IFrame
     * @param {string} id Recommendation widget ID
     * @returns {HTMLElement}
     */
    createIFrameWithId(id) {
      var iframe = document.createElement('iframe');

      iframe.setAttribute('style', 'border: 0px; width: 100%;');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('onload', 'window.Metisa.resizeIframe(this)');
      iframe.setAttribute('id', 'widget-' + id);

      return iframe;
    }

    /**
     * Resizes `iframe` element
     * @memberof composeClass.IFrame
     * @param {HTMLElement} obj `iframe` element to be resized.
     */
    resizeIframe(obj) {
      obj.style.height = 0;
      obj.style.height = obj.contentWindow.document.body.offsetHeight + 'px';
    }

    /**
     * Returns loader HTML
     * @memberof composeClass.IFrame
     * @returns {string}
     */
    getLoaderHTML() {
      return '<!doctype html><html><style>body{height: 100px;}.cs-loader{height: 100%; width: 100%;}.cs-loader-inner{transform: translateY(-50%); top: 50%; position: absolute; width: calc(100% - 200px); color: #A2A3A3; padding: 0 100px; text-align: center;}.cs-loader-inner label{font-size: 20px; opacity: 0; display: inline-block;}@keyframes lol{0%{opacity: 0; transform: translateX(-300px);}33%{opacity: 1; transform: translateX(0px);}66%{opacity: 1; transform: translateX(0px);}100%{opacity: 0; transform: translateX(300px);}}@-webkit-keyframes lol{0%{opacity: 0; -webkit-transform: translateX(-300px);}33%{opacity: 1; -webkit-transform: translateX(0px);}66%{opacity: 1; -webkit-transform: translateX(0px);}100%{opacity: 0; -webkit-transform: translateX(300px);}}.cs-loader-inner label:nth-child(6){-webkit-animation: lol 3s infinite ease-in-out; animation: lol 3s infinite ease-in-out;}.cs-loader-inner label:nth-child(5){-webkit-animation: lol 3s 100ms infinite ease-in-out; animation: lol 3s 100ms infinite ease-in-out;}.cs-loader-inner label:nth-child(4){-webkit-animation: lol 3s 200ms infinite ease-in-out; animation: lol 3s 200ms infinite ease-in-out;}.cs-loader-inner label:nth-child(3){-webkit-animation: lol 3s 300ms infinite ease-in-out; animation: lol 3s 300ms infinite ease-in-out;}.cs-loader-inner label:nth-child(2){-webkit-animation: lol 3s 400ms infinite ease-in-out; animation: lol 3s 400ms infinite ease-in-out;}.cs-loader-inner label:nth-child(1){-webkit-animation: lol 3s 500ms infinite ease-in-out; animation: lol 3s 500ms infinite ease-in-out;}</style><body> <div class="cs-loader"> <div class="cs-loader-inner"> <label>●</label> <label>●</label> <label>●</label> <label>●</label> <label>●</label> <label>●</label> </div></div></body></html>';
    }

    /**
     * Returns decoded HTML entities
     * @memberof composeClass.IFrame
     * @param {string} str HTML entities
     * @returns {string}
     */
    decodeHtmlEntities(str) {
      return str.replace(/&#?(\w+);/g, function(match, dec) {
        if (isNaN(dec)) {
          var chars = {
            quot: 34,
            amp: 38,
            lt: 60,
            gt: 62,
            nbsp: 160,
            copy: 169,
            reg: 174,
            deg: 176,
            frasl: 47,
            trade: 8482,
            euro: 8364,
            Agrave: 192,
            Aacute: 193,
            Acirc: 194,
            Atilde: 195,
            Auml: 196,
            Aring: 197,
            AElig: 198,
            Ccedil: 199,
            Egrave: 200,
            Eacute: 201,
            Ecirc: 202,
            Euml: 203,
            Igrave: 204,
            Iacute: 205,
            Icirc: 206,
            Iuml: 207,
            ETH: 208,
            Ntilde: 209,
            Ograve: 210,
            Oacute: 211,
            Ocirc: 212,
            Otilde: 213,
            Ouml: 214,
            times: 215,
            Oslash: 216,
            Ugrave: 217,
            Uacute: 218,
            Ucirc: 219,
            Uuml: 220,
            Yacute: 221,
            THORN: 222,
            szlig: 223,
            agrave: 224,
            aacute: 225,
            acirc: 226,
            atilde: 227,
            auml: 228,
            aring: 229,
            aelig: 230,
            ccedil: 231,
            egrave: 232,
            eacute: 233,
            ecirc: 234,
            euml: 235,
            igrave: 236,
            iacute: 237,
            icirc: 238,
            iuml: 239,
            eth: 240,
            ntilde: 241,
            ograve: 242,
            oacute: 243,
            ocirc: 244,
            otilde: 245,
            ouml: 246,
            divide: 247,
            oslash: 248,
            ugrave: 249,
            uacute: 250,
            ucirc: 251,
            uuml: 252,
            yacute: 253,
            thorn: 254,
            yuml: 255,
            lsquo: 8216,
            rsquo: 8217,
            sbquo: 8218,
            ldquo: 8220,
            rdquo: 8221,
            bdquo: 8222,
            dagger: 8224,
            Dagger: 8225,
            permil: 8240,
            lsaquo: 8249,
            rsaquo: 8250,
            spades: 9824,
            clubs: 9827,
            hearts: 9829,
            diams: 9830,
            oline: 8254,
            larr: 8592,
            uarr: 8593,
            rarr: 8594,
            darr: 8595,
            hellip: 133,
            ndash: 150,
            mdash: 151,
            iexcl: 161,
            cent: 162,
            pound: 163,
            curren: 164,
            yen: 165,
            brvbar: 166,
            brkbar: 166,
            sect: 167,
            uml: 168,
            die: 168,
            ordf: 170,
            laquo: 171,
            not: 172,
            shy: 173,
            macr: 175,
            hibar: 175,
            plusmn: 177,
            sup2: 178,
            sup3: 179,
            acute: 180,
            micro: 181,
            para: 182,
            middot: 183,
            cedil: 184,
            sup1: 185,
            ordm: 186,
            raquo: 187,
            frac14: 188,
            frac12: 189,
            frac34: 190,
            iquest: 191,
            Alpha: 913,
            alpha: 945,
            Beta: 914,
            beta: 946,
            Gamma: 915,
            gamma: 947,
            Delta: 916,
            delta: 948,
            Epsilon: 917,
            epsilon: 949,
            Zeta: 918,
            zeta: 950,
            Eta: 919,
            eta: 951,
            Theta: 920,
            theta: 952,
            Iota: 921,
            iota: 953,
            Kappa: 922,
            kappa: 954,
            Lambda: 923,
            lambda: 955,
            Mu: 924,
            mu: 956,
            Nu: 925,
            nu: 957,
            Xi: 926,
            xi: 958,
            Omicron: 927,
            omicron: 959,
            Pi: 928,
            pi: 960,
            Rho: 929,
            rho: 961,
            Sigma: 931,
            sigma: 963,
            Tau: 932,
            tau: 964,
            Upsilon: 933,
            upsilon: 965,
            Phi: 934,
            phi: 966,
            Chi: 935,
            chi: 967,
            Psi: 936,
            psi: 968,
            Omega: 937,
            omega: 969
          };

          if (chars[dec] !== undefined) {
            dec = chars[dec];
          }
        }
        return String.fromCharCode(dec);
      });
    }
  };
};

module.exports = composeClass;

},{}],4:[function(require,module,exports){
const MetisaDom = require('./Metisa/dom');
const util = require('./util');


/**
 * Loads jQuery and {@link MetisaDom} object into window object in browser
 * @private
 * @requires MetisaDom
 * @requires getUtil
 */
function browser() {
  if (util.environment !== 'browser' ) {
    return console.warn('Metisa browser can only run inside a browser');
  }
  window.jQuery = window.$ = $ || jQuery || {};

  window.Metisa = new MetisaDom();
}

module.exports = (browser)();

},{"./Metisa/dom":2,"./util":5}],5:[function(require,module,exports){
/**
 * Gets SDK utilities
 *
 * @private
 * @returns {UtilObj}
 */
function getUtil() {
  /**
   * Object containing utililities
   * @typedef {Object} UtilObj
   * @property {string} environment Environment that Metisa object is exposed to. Returns `'browser'` or `node`.
   * @property {function} compose [Function](#GetUtil-composeFunc) for composing classes
   * @memberof getUtil
   */
  /**
   * Returns a composed class.
   *
   * @param  {class} original Class to be composed to.
   * @return {class}
   */
  var composeFunc = function(original) {
    return function() {
      const compositions = Array.prototype.slice.call(arguments);
      var composed = original;
      for (var i = 0; i < compositions.length; i++) {
        composed = compositions[i](composed);
      }
      return composed;
    }
  };
  return {
    environment: typeof window === 'object' ? 'browser' : 'node',
    compose: composeFunc,
  };
}
module.exports = (getUtil)();

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogT3B0aW9ucyBvYmplY3QgZGVmaW5pdGlvblxuICogQHByaXZhdGVcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE9wdHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiYXNlVXJsPWh0dHBzOi8vYXNrbWV0aXNhLmNvbS8gQmFzZSBVUkwgb2YgQVBJXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaXRlbUVuZHBvaW50PS9hcGkvdjEvcHJvZHVjdC1jb2xsZWN0aW9uIFBhdGggb2YgQVBJIGVuZHBvaW50IGZvciBjcmVhdGluZyBvciB1cGRhdGluZyBpdGVtc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGFjdGlvbkVuZHBvaW50PS9hcGkvdjEvb3JkZXItdHJhbnNhY3Rpb24gUGF0aCBvZiBBUEkgZW5kcG9pbnQgZm9yIGNyZWF0aW5nIG9yIHVwZGF0aW5nIGFjdGlvbnNcbiAqL1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgYW55IGVudmlyb25tZW50LlxuXG4gKi9cbmNsYXNzIE1ldGlzYSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBNZXRpc2FgIHdpdGggYG9wdHNgLlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhIGNvbnRydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKFxuICAgIHtcbiAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXNrbWV0aXNhLmNvbS8nLFxuICAgICAgICBpdGVtRW5kcG9pbnQ6IFwiL2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb25cIixcbiAgICAgICAgYWN0aW9uRW5kcG9pbnQ6IFwiL2FwaS92MS9vcmRlci10cmFuc2FjdGlvblwiLFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gd3JpdGUgbG9ncyBpbiBicm93c2VyIGNvbnNvbGVcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmRlYnVnID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhgaW5pdGlhbGlzZWQgTWV0aXNhIHdpdGggJHtKU09OLnN0cmluZ2lmeSh0aGlzLm9wdHMpfSFgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBpdCBpcyByZWFkeSB0byBzdGFydCBjYWxsaW5nIEFQSS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgaXNSZWFkeVRvU3RhcnQoKSB7XG4gICAgdmFyIGlzUmVhZHkgPSBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgb3B0aW9ucyBmcm9tIGBtdCgne3sgb3B0aW9uIH19Jywge3sgdmFsdWUgfX0pYC5cbiAgICovXG4gIHJlZ2lzdGVyT3B0aW9ucygpIHtcbiAgICBpZiAoYXJndW1lbnRzWzBdID09PSAnYmFzZVVybCcpIHtcbiAgICAgIC8vIEluaXQgQmFzZSBVUkwgZm9yIHRlc3RpbmdcbiAgICAgIHRoaXMubG9nKCdCYXNlIFVSTCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLm9wdHMuYmFzZVVybCA9IGFyZ3VtZW50c1sxXTsgLy8gb3ZlcnJpZGVcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAvLyBJbml0IEl0ZW0gb2JqZWN0XG4gICAgICB0aGlzLmxvZygnSXRlbSBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLml0ZW0gPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdhY3Rpb24nKSB7XG4gICAgICAvLyBJbml0IEFjdGlvbiBvYmplY3RcbiAgICAgIHRoaXMubG9nKCdBY3Rpb24gaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5hY3Rpb24gPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdzbHVnJykge1xuICAgICAgLy8gSW5pdCBzdG9yZSBzbHVnXG4gICAgICB0aGlzLmxvZygnU3RvcmUgc2x1ZyBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLnNsdWcgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICd1c2VyJykge1xuICAgICAgLy8gSW5pdCB1c2VyIGJhc2VkIHJlY29tbWVuZGF0aW9uc1xuICAgICAgdGhpcy5sb2coJ1VzZXIgSUQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy51c2VySWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdjYXRlZ29yeScpIHtcbiAgICAgIC8vIEluaXQgY2F0ZWdvcnlcbiAgICAgIHRoaXMubG9nKCdDYXRlZ29yeSBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmNhdGVnb3J5TmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2JyYW5kJykge1xuICAgICAgLy8gSW5pdCBicmFuZFxuICAgICAgdGhpcy5sb2coJ0JyYW5kIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuYnJhbmRuYW1lID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnaXRlbUlkJykge1xuICAgICAgLy8gSW5pdCBpdGVtIGlkXG4gICAgICB0aGlzLmxvZygnSXRlbSBJRCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLml0ZW1JZCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2dlbmRlcicpIHtcbiAgICAgIC8vIEluaXQgZ2VuZGVyXG4gICAgICB0aGlzLmxvZygnR2VuZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuZ2VuZGVyID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnc2Vzc2lvbicpIHtcbiAgICAgIC8vIEluaXQgc2Vzc2lvblxuICAgICAgdGhpcy5sb2coJ1Nlc3Npb24gaXMnLCBhcmd1bWVudHNbMV0pXG4gICAgICB0aGlzLnNlc3Npb25JZCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2xhbmd1YWdlJykge1xuICAgICAgdGhpcy5sb2coJ0xhbmd1YWdlIGlzJywgYXJndW1lbnRzWzFdKVxuICAgICAgdGhpcy5sYW5ndWFnZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYTtcbiIsInZhciBNZXRpc2FDb3JlID0gcmVxdWlyZSgnLi4vY29yZScpO1xudmFyIHdpdGhJRnJhbWUgPSByZXF1aXJlKCcuL3dpdGhJRnJhbWUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xudmFyIGNvbXBvc2UgPSB1dGlsLmNvbXBvc2U7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyB7QGxpbmsgTWV0aXNhfSBjbGFzcyB0aGF0IGNvbXBvc2VzIHdpdGgge0BsaW5rIGNvbXBvc2VDbGFzcy5JRnJhbWV9XG4gKiBAcmVxdWlyZXMgTWV0aXNhXG4gKiBAcmVxdWlyZXMgY29tcG9zZUNsYXNzXG4gKiBAcmVxdWlyZXMgZ2V0VXRpbC5jb21wb3NlXG4gKi9cbnZhciBNZXRpc2F3aXRoSUZyYW1lID0gY29tcG9zZShNZXRpc2FDb3JlKSh3aXRoSUZyYW1lKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEJhc2UgY2xhc3MgZm9yIGJyb3dzZXIgZW52aXJvbm1lbnQuIFRoaXMgaXMgaW5pdGlhbGlzZWQgYW5kIGV4cG9zZWQgdG8gYHdpbmRvdy5NZXRpc2FgIHdoZW4geW91IGltcG9ydCB0aHJvdWdoIG91ciBbZXhhbXBsZV0oLyNpbnN0YWxsYXRpb24pLlxuICogQGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZVxuICovXG5jbGFzcyBNZXRpc2FEb20gZXh0ZW5kcyBNZXRpc2F3aXRoSUZyYW1lIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYE1ldGlzYURvbWAgd2l0aCBgb3B0c2AuXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0cyBPcHRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2FEb20gY29udHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIGlmICgkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ01ldGlzYSBEb20gcmVxdWlyZXMgalF1ZXJ5IHRvIGJlIGF2YWlsYWJsZSEnKVxuICAgIH1cbiAgICBzdXBlcihvcHRzKTtcblxuICAgIGNvbnNvbGUubG9nKGBpbml0aWFsaXNlZCBNZXRpc2EgRG9tIHdpdGggJHtKU09OLnN0cmluZ2lmeSh0aGlzLm9wdHMpfSFgKTtcbiAgICB0aGlzLnJlbmRlcldpZGdldCA9IHRoaXMucmVuZGVyV2lkZ2V0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWdpc3Rlck9wdGlvbnMgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5hdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHJlZ2lzdGVyZWQgb3B0aW9ucyB0byBgd2luZG93Lm10YC5cbiAgICovXG4gIGF0dGFjaFJlZ2lzdGVyT3B0aW9uc1RvV2luZG93KCkge1xuICAgIHdpbmRvdy5tdCA9IHRoaXMucmVnaXN0ZXJPcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBvcHRpb25zIGZyb20gYG10KCd7eyBvcHRpb24gfX0nLCB7eyB2YWx1ZSB9fSlgYW5kIGRldGVybWluZXMgd2hldGhlciBpdGVtIG9yIGFjdGlvbiBkYXRhIHNob3VsZCBiZSBoYW5kbGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xuICAgIHN1cGVyLnJlZ2lzdGVyT3B0aW9ucy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNSZWFkeVRvU3RhcnQpIHtcbiAgICAgIHRoaXMucmVuZGVyV2lkZ2V0KCk7XG4gICAgICBpZiAodGhpcy5pdGVtKSB7XG4gICAgICAgIHRoaXMudHJhY2soJ2l0ZW0nLCB0aGlzLml0ZW0pO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLmFjdGlvbikge1xuICAgICAgICB0aGlzLnRyYWNrKCdhY3Rpb24nLCB0aGlzLmFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgTWV0aXNhIHdpZGdldHMgaW4gdGhlIGJyb3dzZXIuXG4gICAqL1xuICByZW5kZXJXaWRnZXQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgd2lkZ2V0cyA9ICQoJy5tdC13aWRnZXQnKTtcblxuICAgIC8vIENvbnZlcnQgd2lkZ2V0cyBub2RlbGlzdCB0byB0cnVlIGFycmF5XG4gICAgd2lkZ2V0cyA9ICQubWFrZUFycmF5KHdpZGdldHMpO1xuXG4gICAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHdpZGdldCkge1xuICAgICAgLy8gUmVuZGVyIHdpZGdldCB1c2luZyBBamF4IHNvIHdlIGNhbiBncmFjZWZ1bGx5IGRlZ3JhZGUgaWYgdGhlcmUgaXMgbm8gY29udGVudCBhdmFpbGFibGVcbiAgICAgIHZhciB3aWRnZXRJZCA9IHdpZGdldC5kYXRhc2V0LndpZGdldElkLFxuICAgICAgICB1c2VySWQgPSB3aWRnZXQuZGF0YXNldC51c2VySWQsXG4gICAgICAgIGl0ZW1JZCA9IHdpZGdldC5kYXRhc2V0Lml0ZW1JZCxcbiAgICAgICAgY2F0ZWdvcnlOYW1lID0gd2lkZ2V0LmRhdGFzZXQuY2F0ZWdvcnlOYW1lLFxuICAgICAgICBicmFuZG5hbWUgPSB3aWRnZXQuZGF0YXNldC5icmFuZG5hbWUsXG4gICAgICAgIHNlc3Npb25JZCA9IHdpZGdldC5kYXRhc2V0LnNlc3Npb25JZCxcbiAgICAgICAgbGFuZ3VhZ2UgPSB3aWRnZXQuZGF0YXNldC5sYW5ndWFnZSxcbiAgICAgICAgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyAnL2FwaS92MS93aWRnZXQtY3VzdG9tZXI/d2lkZ2V0X2lkPScgKyB3aWRnZXRJZDtcblxuICAgICAgLy8gT3ZlcnJpZGUgdXNlciwgY2F0ZWdvcnkgb3IgYnJhbmRcbiAgICAgIGlmICh1c2VySWQpIHRoaXMudXNlcklkID0gdXNlcklkO1xuICAgICAgaWYgKGl0ZW1JZCkgdGhpcy5pdGVtSWQgPSBpdGVtSWQ7XG4gICAgICBpZiAoY2F0ZWdvcnlOYW1lKSB0aGlzLmNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5TmFtZTtcbiAgICAgIGlmIChicmFuZG5hbWUpIHRoaXMuYnJhbmRuYW1lID0gYnJhbmRuYW1lO1xuICAgICAgaWYgKHNlc3Npb25JZCkgdGhpcy5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgICBpZiAobGFuZ3VhZ2UpIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcblxuICAgICAgaWYgKHRoaXMudXNlcklkKSB7XG4gICAgICAgIHVybCArPSAnJmN1c3RvbWVyX2lkPScgKyBlc2NhcGUodGhpcy51c2VySWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pdGVtSWQpIHtcbiAgICAgICAgdXJsICs9ICcmcHJvZHVjdF9pZD0nICsgZXNjYXBlKHRoaXMuaXRlbUlkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2F0ZWdvcnlOYW1lKSB7XG4gICAgICAgIHVybCArPSAnJmNhdGVnb3J5X25hbWU9JyArIGVzY2FwZSh0aGlzLmNhdGVnb3J5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJyYW5kbmFtZSkge1xuICAgICAgICB1cmwgKz0gJyZicmFuZG5hbWU9JyArIGVzY2FwZSh0aGlzLmJyYW5kbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmdlbmRlcikge1xuICAgICAgICB1cmwgKz0gJyZnZW5kZXI9JyArIGVzY2FwZSh0aGlzLmdlbmRlcik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlc3Npb25JZCkge1xuICAgICAgICB1cmwgKz0gJyZzZXNzaW9uX2lkPScgKyBlc2NhcGUodGhpcy5zZXNzaW9uSWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYW5ndWFnZSkge1xuICAgICAgICB1cmwgKz0gJyZsYW5ndWFnZT0nICsgZXNjYXBlKHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgfVxuXG4gICAgICB1cmwgKz0gJyZmb3JtYXQ9aHRtbCc7XG4gICAgICAvLyBQcmVwYXJlIGlmcmFtZVxuICAgICAgdmFyIGlmcmFtZSA9IHNlbGYuY3JlYXRlSUZyYW1lV2l0aElkKHdpZGdldElkKTtcblxuICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgIC8vIFJlbmRlciBsb2FkZXJcbiAgICAgIHZhciBodG1sID0gc2VsZi5nZXRMb2FkZXJIVE1MKCk7XG5cbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgIC8vIERlbGV0ZSBsb2FkZXIgaWZyYW1lXG4gICAgICAgIHZhciBvbGRJRnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lkZ2V0LScgK1xuICAgICAgICB3aWRnZXRJZCk7XG5cbiAgICAgICAgdmFyIGlmcmFtZVBhcmVudCA9IG9sZElGcmFtZS5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChpZnJhbWVQYXJlbnQpIHtcbiAgICAgICAgICB3aGlsZSAoaWZyYW1lUGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGlmcmFtZVBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWVQYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGlmcmFtZSBmb3Igd2lkZ2V0XG4gICAgICAgIHZhciBpZnJhbWUgPSBzZWxmLmNyZWF0ZUlGcmFtZVdpdGhJZCh3aWRnZXRJZCk7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgICAgICAgIHZhciBodG1sID0gc2VsZi5kZWNvZGVIdG1sRW50aXRpZXMoZGF0YSk7XG5cbiAgICAgICAgICBpZiAoaHRtbCkge1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQub3BlbigpO1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoaHRtbCk7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUuc3R5bGUubWFyZ2luQm90dG9tID0gJzMwcHgnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBIdG1sIHdpbGwgYmUgZW1wdHkgaWYgc3RvcmUgaGFzIHJ1biBvdXQgb2YgZnJlZSBzYWxlcyBjcmVkaXRzLlxuICAgICAgICAgICAgLy8gR3JhY2VmdWxseSBmYWlsIHRvIGxvYWQgd2lkZ2V0IGJ5IHJlbW92aW5nIHRoZSBpZnJhbWUgZnJvbSBET00uXG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcgKyBzdGF0dXNUZXh0KTtcbiAgICAgICAgICAvLyBSZW1vdmUgaWZyYW1lIGZyb20gRE9NXG4gICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxuICAvKipcbiAgICogU3RhcnRzIHRyYWNraW5nIGJ5IHN1Ym1pdHRpbmcgaXRlbSBvciBhY3Rpb24gZGF0YSB0byB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2F0IENhdGVnb3J5IG5hbWUgb2YgZGF0YSAoYWxsb3dlZCB2YWx1ZXM6IGBcIml0ZW1cImAsYFwiYWN0aW9uXCJgKVxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBPYmplY3Qgb2YgaXRlbSBvciBhY3Rpb24gZGF0YVxuICAgKi9cblxuICB0cmFjayhjYXQsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5zbHVnKSB7XG4gICAgICBpZiAoY2F0ID09PSAnaXRlbScpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVPclVwZGF0ZUl0ZW0oZGF0YSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjYXQgPT09ICdhY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlT3JVcGRhdGVBY3Rpb24oZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaXRlbSBpZiBpdCBkb2VzIG5vdCBleGlzdCBpbiBNZXRpc2Egb3IgdXBkYXRlcyB0aGUgaXRlbS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW1EYXRhIFtpdGVtRGF0YV17QGxpbmsgQlJPV1NFUi9TQ0hFTUEuaHRtbCNJdGVtLWRhdGF9IG9iamVjdCB0byBiZSBzdWJtaXR0ZWQgdG8gdGhlIGl0ZW0gQVBJIGVuZHBvaW50XG4gICAqL1xuICBjcmVhdGVPclVwZGF0ZUl0ZW0oZGF0YSkge1xuICAgIHZhciB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArIHRoaXMub3B0cy5pdGVtRW5kcG9pbnQ7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICB9LFxuICAgICAgc3RhdHVzQ29kZToge1xuICAgICAgICAgIDUwMDogZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnK3hocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhY3Rpb24gaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIGFjdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbkRhdGEgW2FjdGlvbkRhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjQWN0aW9uLWRhdGF9IG9iamVjdCB0byBiZSBzdWJtaXR0ZWQgdG8gdGhlIGFjdGlvbiBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlQWN0aW9uKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMuYWN0aW9uRW5kcG9pbnQ7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICB9LFxuICAgICAgc3RhdHVzQ29kZToge1xuICAgICAgICAgIDUwMDogZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnK3hocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIGxvZ3MgYWJvdXQgcmVnaXN0ZXJlZCBvcHRpb25zIHRvIGJyb3dzZXIgY29uc29sZSB3aGVuIGBkZWJ1Z2AgcHJvcGVydHkgb2YgYE1ldGlzYURvbWAgb2JqZWN0IGlzIGB0cnVlYFxuICAgKi9cbiAgbG9nKCkge1xuICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0aXNhRG9tO1xuIiwiLyoqXG4gKiBSZXR1cm5zIHtAbGluayBjb21wb3NlQ2xhc3MuSUZyYW1lfSBjb21wb3NlZCB3aXRoIGBjb21wb3NlZENsYXNzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtICB7Y2xhc3N9IGNvbXBvc2VkQ2xhc3MgYGNvbXBvc2VkQ2xhc3NgIHRvIGJlIGNvbXBvc2VkLlxuICogQHJldHVybnMge2NvbXBvc2VDbGFzcy5JRnJhbWV9XG4gKi9cblxudmFyIGNvbXBvc2VDbGFzcyA9IGZ1bmN0aW9uKGNvbXBvc2VkQ2xhc3MpIHtcbiAgLyoqXG4gICAqIGA8aWZyYW1lPmAgZWxlbWVudCBpbiB0aGUgcmVjb21tZW5kYXRpb24gd2lkZ2V0LlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBJRnJhbWVcbiAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzc1xuICAgKi9cbiAgcmV0dXJuIGNsYXNzIElGcmFtZSBleHRlbmRzIGNvbXBvc2VkQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYGlmcmFtZWAgZWxlbWVudFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFJlY29tbWVuZGF0aW9uIHdpZGdldCBJRFxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjcmVhdGVJRnJhbWVXaXRoSWQoaWQpIHtcbiAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnYm9yZGVyOiAwcHg7IHdpZHRoOiAxMDAlOycpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc2Nyb2xsaW5nJywgJ25vJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdvbmxvYWQnLCAnd2luZG93Lk1ldGlzYS5yZXNpemVJZnJhbWUodGhpcyknKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpZGdldC0nICsgaWQpO1xuXG4gICAgICByZXR1cm4gaWZyYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2l6ZXMgYGlmcmFtZWAgZWxlbWVudFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIGBpZnJhbWVgIGVsZW1lbnQgdG8gYmUgcmVzaXplZC5cbiAgICAgKi9cbiAgICByZXNpemVJZnJhbWUob2JqKSB7XG4gICAgICBvYmouc3R5bGUuaGVpZ2h0ID0gMDtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSBvYmouY29udGVudFdpbmRvdy5kb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCArICdweCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBsb2FkZXIgSFRNTFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRMb2FkZXJIVE1MKCkge1xuICAgICAgcmV0dXJuICc8IWRvY3R5cGUgaHRtbD48aHRtbD48c3R5bGU+Ym9keXtoZWlnaHQ6IDEwMHB4O30uY3MtbG9hZGVye2hlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7fS5jcy1sb2FkZXItaW5uZXJ7dHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpOyB0b3A6IDUwJTsgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDogY2FsYygxMDAlIC0gMjAwcHgpOyBjb2xvcjogI0EyQTNBMzsgcGFkZGluZzogMCAxMDBweDsgdGV4dC1hbGlnbjogY2VudGVyO30uY3MtbG9hZGVyLWlubmVyIGxhYmVse2ZvbnQtc2l6ZTogMjBweDsgb3BhY2l0eTogMDsgZGlzcGxheTogaW5saW5lLWJsb2NrO31Aa2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTt9MzMle29wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO302NiV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTt9fUAtd2Via2l0LWtleWZyYW1lcyBsb2x7MCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTt9MzMle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO30xMDAle29wYWNpdHk6IDA7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTt9fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDYpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg1KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAxMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNCl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMjAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDMpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDMwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgyKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA0MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMSl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgNTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fTwvc3R5bGU+PGJvZHk+IDxkaXYgY2xhc3M9XCJjcy1sb2FkZXJcIj4gPGRpdiBjbGFzcz1cImNzLWxvYWRlci1pbm5lclwiPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8L2Rpdj48L2Rpdj48L2JvZHk+PC9odG1sPic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkZWNvZGVkIEhUTUwgZW50aXRpZXNcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgSFRNTCBlbnRpdGllc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZGVjb2RlSHRtbEVudGl0aWVzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIz8oXFx3Kyk7L2csIGZ1bmN0aW9uKG1hdGNoLCBkZWMpIHtcbiAgICAgICAgaWYgKGlzTmFOKGRlYykpIHtcbiAgICAgICAgICB2YXIgY2hhcnMgPSB7XG4gICAgICAgICAgICBxdW90OiAzNCxcbiAgICAgICAgICAgIGFtcDogMzgsXG4gICAgICAgICAgICBsdDogNjAsXG4gICAgICAgICAgICBndDogNjIsXG4gICAgICAgICAgICBuYnNwOiAxNjAsXG4gICAgICAgICAgICBjb3B5OiAxNjksXG4gICAgICAgICAgICByZWc6IDE3NCxcbiAgICAgICAgICAgIGRlZzogMTc2LFxuICAgICAgICAgICAgZnJhc2w6IDQ3LFxuICAgICAgICAgICAgdHJhZGU6IDg0ODIsXG4gICAgICAgICAgICBldXJvOiA4MzY0LFxuICAgICAgICAgICAgQWdyYXZlOiAxOTIsXG4gICAgICAgICAgICBBYWN1dGU6IDE5MyxcbiAgICAgICAgICAgIEFjaXJjOiAxOTQsXG4gICAgICAgICAgICBBdGlsZGU6IDE5NSxcbiAgICAgICAgICAgIEF1bWw6IDE5NixcbiAgICAgICAgICAgIEFyaW5nOiAxOTcsXG4gICAgICAgICAgICBBRWxpZzogMTk4LFxuICAgICAgICAgICAgQ2NlZGlsOiAxOTksXG4gICAgICAgICAgICBFZ3JhdmU6IDIwMCxcbiAgICAgICAgICAgIEVhY3V0ZTogMjAxLFxuICAgICAgICAgICAgRWNpcmM6IDIwMixcbiAgICAgICAgICAgIEV1bWw6IDIwMyxcbiAgICAgICAgICAgIElncmF2ZTogMjA0LFxuICAgICAgICAgICAgSWFjdXRlOiAyMDUsXG4gICAgICAgICAgICBJY2lyYzogMjA2LFxuICAgICAgICAgICAgSXVtbDogMjA3LFxuICAgICAgICAgICAgRVRIOiAyMDgsXG4gICAgICAgICAgICBOdGlsZGU6IDIwOSxcbiAgICAgICAgICAgIE9ncmF2ZTogMjEwLFxuICAgICAgICAgICAgT2FjdXRlOiAyMTEsXG4gICAgICAgICAgICBPY2lyYzogMjEyLFxuICAgICAgICAgICAgT3RpbGRlOiAyMTMsXG4gICAgICAgICAgICBPdW1sOiAyMTQsXG4gICAgICAgICAgICB0aW1lczogMjE1LFxuICAgICAgICAgICAgT3NsYXNoOiAyMTYsXG4gICAgICAgICAgICBVZ3JhdmU6IDIxNyxcbiAgICAgICAgICAgIFVhY3V0ZTogMjE4LFxuICAgICAgICAgICAgVWNpcmM6IDIxOSxcbiAgICAgICAgICAgIFV1bWw6IDIyMCxcbiAgICAgICAgICAgIFlhY3V0ZTogMjIxLFxuICAgICAgICAgICAgVEhPUk46IDIyMixcbiAgICAgICAgICAgIHN6bGlnOiAyMjMsXG4gICAgICAgICAgICBhZ3JhdmU6IDIyNCxcbiAgICAgICAgICAgIGFhY3V0ZTogMjI1LFxuICAgICAgICAgICAgYWNpcmM6IDIyNixcbiAgICAgICAgICAgIGF0aWxkZTogMjI3LFxuICAgICAgICAgICAgYXVtbDogMjI4LFxuICAgICAgICAgICAgYXJpbmc6IDIyOSxcbiAgICAgICAgICAgIGFlbGlnOiAyMzAsXG4gICAgICAgICAgICBjY2VkaWw6IDIzMSxcbiAgICAgICAgICAgIGVncmF2ZTogMjMyLFxuICAgICAgICAgICAgZWFjdXRlOiAyMzMsXG4gICAgICAgICAgICBlY2lyYzogMjM0LFxuICAgICAgICAgICAgZXVtbDogMjM1LFxuICAgICAgICAgICAgaWdyYXZlOiAyMzYsXG4gICAgICAgICAgICBpYWN1dGU6IDIzNyxcbiAgICAgICAgICAgIGljaXJjOiAyMzgsXG4gICAgICAgICAgICBpdW1sOiAyMzksXG4gICAgICAgICAgICBldGg6IDI0MCxcbiAgICAgICAgICAgIG50aWxkZTogMjQxLFxuICAgICAgICAgICAgb2dyYXZlOiAyNDIsXG4gICAgICAgICAgICBvYWN1dGU6IDI0MyxcbiAgICAgICAgICAgIG9jaXJjOiAyNDQsXG4gICAgICAgICAgICBvdGlsZGU6IDI0NSxcbiAgICAgICAgICAgIG91bWw6IDI0NixcbiAgICAgICAgICAgIGRpdmlkZTogMjQ3LFxuICAgICAgICAgICAgb3NsYXNoOiAyNDgsXG4gICAgICAgICAgICB1Z3JhdmU6IDI0OSxcbiAgICAgICAgICAgIHVhY3V0ZTogMjUwLFxuICAgICAgICAgICAgdWNpcmM6IDI1MSxcbiAgICAgICAgICAgIHV1bWw6IDI1MixcbiAgICAgICAgICAgIHlhY3V0ZTogMjUzLFxuICAgICAgICAgICAgdGhvcm46IDI1NCxcbiAgICAgICAgICAgIHl1bWw6IDI1NSxcbiAgICAgICAgICAgIGxzcXVvOiA4MjE2LFxuICAgICAgICAgICAgcnNxdW86IDgyMTcsXG4gICAgICAgICAgICBzYnF1bzogODIxOCxcbiAgICAgICAgICAgIGxkcXVvOiA4MjIwLFxuICAgICAgICAgICAgcmRxdW86IDgyMjEsXG4gICAgICAgICAgICBiZHF1bzogODIyMixcbiAgICAgICAgICAgIGRhZ2dlcjogODIyNCxcbiAgICAgICAgICAgIERhZ2dlcjogODIyNSxcbiAgICAgICAgICAgIHBlcm1pbDogODI0MCxcbiAgICAgICAgICAgIGxzYXF1bzogODI0OSxcbiAgICAgICAgICAgIHJzYXF1bzogODI1MCxcbiAgICAgICAgICAgIHNwYWRlczogOTgyNCxcbiAgICAgICAgICAgIGNsdWJzOiA5ODI3LFxuICAgICAgICAgICAgaGVhcnRzOiA5ODI5LFxuICAgICAgICAgICAgZGlhbXM6IDk4MzAsXG4gICAgICAgICAgICBvbGluZTogODI1NCxcbiAgICAgICAgICAgIGxhcnI6IDg1OTIsXG4gICAgICAgICAgICB1YXJyOiA4NTkzLFxuICAgICAgICAgICAgcmFycjogODU5NCxcbiAgICAgICAgICAgIGRhcnI6IDg1OTUsXG4gICAgICAgICAgICBoZWxsaXA6IDEzMyxcbiAgICAgICAgICAgIG5kYXNoOiAxNTAsXG4gICAgICAgICAgICBtZGFzaDogMTUxLFxuICAgICAgICAgICAgaWV4Y2w6IDE2MSxcbiAgICAgICAgICAgIGNlbnQ6IDE2MixcbiAgICAgICAgICAgIHBvdW5kOiAxNjMsXG4gICAgICAgICAgICBjdXJyZW46IDE2NCxcbiAgICAgICAgICAgIHllbjogMTY1LFxuICAgICAgICAgICAgYnJ2YmFyOiAxNjYsXG4gICAgICAgICAgICBicmtiYXI6IDE2NixcbiAgICAgICAgICAgIHNlY3Q6IDE2NyxcbiAgICAgICAgICAgIHVtbDogMTY4LFxuICAgICAgICAgICAgZGllOiAxNjgsXG4gICAgICAgICAgICBvcmRmOiAxNzAsXG4gICAgICAgICAgICBsYXF1bzogMTcxLFxuICAgICAgICAgICAgbm90OiAxNzIsXG4gICAgICAgICAgICBzaHk6IDE3MyxcbiAgICAgICAgICAgIG1hY3I6IDE3NSxcbiAgICAgICAgICAgIGhpYmFyOiAxNzUsXG4gICAgICAgICAgICBwbHVzbW46IDE3NyxcbiAgICAgICAgICAgIHN1cDI6IDE3OCxcbiAgICAgICAgICAgIHN1cDM6IDE3OSxcbiAgICAgICAgICAgIGFjdXRlOiAxODAsXG4gICAgICAgICAgICBtaWNybzogMTgxLFxuICAgICAgICAgICAgcGFyYTogMTgyLFxuICAgICAgICAgICAgbWlkZG90OiAxODMsXG4gICAgICAgICAgICBjZWRpbDogMTg0LFxuICAgICAgICAgICAgc3VwMTogMTg1LFxuICAgICAgICAgICAgb3JkbTogMTg2LFxuICAgICAgICAgICAgcmFxdW86IDE4NyxcbiAgICAgICAgICAgIGZyYWMxNDogMTg4LFxuICAgICAgICAgICAgZnJhYzEyOiAxODksXG4gICAgICAgICAgICBmcmFjMzQ6IDE5MCxcbiAgICAgICAgICAgIGlxdWVzdDogMTkxLFxuICAgICAgICAgICAgQWxwaGE6IDkxMyxcbiAgICAgICAgICAgIGFscGhhOiA5NDUsXG4gICAgICAgICAgICBCZXRhOiA5MTQsXG4gICAgICAgICAgICBiZXRhOiA5NDYsXG4gICAgICAgICAgICBHYW1tYTogOTE1LFxuICAgICAgICAgICAgZ2FtbWE6IDk0NyxcbiAgICAgICAgICAgIERlbHRhOiA5MTYsXG4gICAgICAgICAgICBkZWx0YTogOTQ4LFxuICAgICAgICAgICAgRXBzaWxvbjogOTE3LFxuICAgICAgICAgICAgZXBzaWxvbjogOTQ5LFxuICAgICAgICAgICAgWmV0YTogOTE4LFxuICAgICAgICAgICAgemV0YTogOTUwLFxuICAgICAgICAgICAgRXRhOiA5MTksXG4gICAgICAgICAgICBldGE6IDk1MSxcbiAgICAgICAgICAgIFRoZXRhOiA5MjAsXG4gICAgICAgICAgICB0aGV0YTogOTUyLFxuICAgICAgICAgICAgSW90YTogOTIxLFxuICAgICAgICAgICAgaW90YTogOTUzLFxuICAgICAgICAgICAgS2FwcGE6IDkyMixcbiAgICAgICAgICAgIGthcHBhOiA5NTQsXG4gICAgICAgICAgICBMYW1iZGE6IDkyMyxcbiAgICAgICAgICAgIGxhbWJkYTogOTU1LFxuICAgICAgICAgICAgTXU6IDkyNCxcbiAgICAgICAgICAgIG11OiA5NTYsXG4gICAgICAgICAgICBOdTogOTI1LFxuICAgICAgICAgICAgbnU6IDk1NyxcbiAgICAgICAgICAgIFhpOiA5MjYsXG4gICAgICAgICAgICB4aTogOTU4LFxuICAgICAgICAgICAgT21pY3JvbjogOTI3LFxuICAgICAgICAgICAgb21pY3JvbjogOTU5LFxuICAgICAgICAgICAgUGk6IDkyOCxcbiAgICAgICAgICAgIHBpOiA5NjAsXG4gICAgICAgICAgICBSaG86IDkyOSxcbiAgICAgICAgICAgIHJobzogOTYxLFxuICAgICAgICAgICAgU2lnbWE6IDkzMSxcbiAgICAgICAgICAgIHNpZ21hOiA5NjMsXG4gICAgICAgICAgICBUYXU6IDkzMixcbiAgICAgICAgICAgIHRhdTogOTY0LFxuICAgICAgICAgICAgVXBzaWxvbjogOTMzLFxuICAgICAgICAgICAgdXBzaWxvbjogOTY1LFxuICAgICAgICAgICAgUGhpOiA5MzQsXG4gICAgICAgICAgICBwaGk6IDk2NixcbiAgICAgICAgICAgIENoaTogOTM1LFxuICAgICAgICAgICAgY2hpOiA5NjcsXG4gICAgICAgICAgICBQc2k6IDkzNixcbiAgICAgICAgICAgIHBzaTogOTY4LFxuICAgICAgICAgICAgT21lZ2E6IDkzNyxcbiAgICAgICAgICAgIG9tZWdhOiA5NjlcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGNoYXJzW2RlY10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVjID0gY2hhcnNbZGVjXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZGVjKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZUNsYXNzO1xuIiwiY29uc3QgTWV0aXNhRG9tID0gcmVxdWlyZSgnLi9NZXRpc2EvZG9tJyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cblxuLyoqXG4gKiBMb2FkcyBqUXVlcnkgYW5kIHtAbGluayBNZXRpc2FEb219IG9iamVjdCBpbnRvIHdpbmRvdyBvYmplY3QgaW4gYnJvd3NlclxuICogQHByaXZhdGVcbiAqIEByZXF1aXJlcyBNZXRpc2FEb21cbiAqIEByZXF1aXJlcyBnZXRVdGlsXG4gKi9cbmZ1bmN0aW9uIGJyb3dzZXIoKSB7XG4gIGlmICh1dGlsLmVudmlyb25tZW50ICE9PSAnYnJvd3NlcicgKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIGJyb3dzZXIgY2FuIG9ubHkgcnVuIGluc2lkZSBhIGJyb3dzZXInKTtcbiAgfVxuICB3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSAkIHx8IGpRdWVyeSB8fCB7fTtcblxuICB3aW5kb3cuTWV0aXNhID0gbmV3IE1ldGlzYURvbSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChicm93c2VyKSgpO1xuIiwiLyoqXG4gKiBHZXRzIFNESyB1dGlsaXRpZXNcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge1V0aWxPYmp9XG4gKi9cbmZ1bmN0aW9uIGdldFV0aWwoKSB7XG4gIC8qKlxuICAgKiBPYmplY3QgY29udGFpbmluZyB1dGlsaWxpdGllc1xuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBVdGlsT2JqXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbnZpcm9ubWVudCBFbnZpcm9ubWVudCB0aGF0IE1ldGlzYSBvYmplY3QgaXMgZXhwb3NlZCB0by4gUmV0dXJucyBgJ2Jyb3dzZXInYCBvciBgbm9kZWAuXG4gICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGNvbXBvc2UgW0Z1bmN0aW9uXSgjR2V0VXRpbC1jb21wb3NlRnVuYykgZm9yIGNvbXBvc2luZyBjbGFzc2VzXG4gICAqIEBtZW1iZXJvZiBnZXRVdGlsXG4gICAqL1xuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXBvc2VkIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtjbGFzc30gb3JpZ2luYWwgQ2xhc3MgdG8gYmUgY29tcG9zZWQgdG8uXG4gICAqIEByZXR1cm4ge2NsYXNzfVxuICAgKi9cbiAgdmFyIGNvbXBvc2VGdW5jID0gZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIGNvbXBvc2VkID0gb3JpZ2luYWw7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb21wb3NlZCA9IGNvbXBvc2l0aW9uc1tpXShjb21wb3NlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcG9zZWQ7XG4gICAgfVxuICB9O1xuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50OiB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/ICdicm93c2VyJyA6ICdub2RlJyxcbiAgICBjb21wb3NlOiBjb21wb3NlRnVuYyxcbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gKGdldFV0aWwpKCk7XG4iXX0=
