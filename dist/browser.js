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
        console.log('Error: ' + xhr);
        console.log(data.responseJSON);
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
        console.log('Error: ' + xhr);
        console.log(data.responseJSON);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBPcHRpb25zIG9iamVjdCBkZWZpbml0aW9uXG4gKiBAcHJpdmF0ZVxuICogQHR5cGVkZWYge09iamVjdH0gT3B0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGJhc2VVcmw9aHR0cHM6Ly9hc2ttZXRpc2EuY29tLyBCYXNlIFVSTCBvZiBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcm9kdWN0RW5kcG9pbnQ9L2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb24gUGF0aCBvZiBBUEkgZW5kcG9pbnQgZm9yIGNyZWF0aW5nIG9yIHVwZGF0aW5nIHByb2R1Y3RzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3JkZXJFbmRwb2ludD0vYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uIFBhdGggb2YgQVBJIGVuZHBvaW50IGZvciBjcmVhdGluZyBvciB1cGRhdGluZyBvcmRlcnNcbiAqL1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgYW55IGVudmlyb25tZW50LlxuXG4gKi9cbmNsYXNzIE1ldGlzYSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBNZXRpc2FgIHdpdGggYG9wdHNgLlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhIGNvbnRydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKFxuICAgIHtcbiAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXNrbWV0aXNhLmNvbS8nLFxuICAgICAgICBwcm9kdWN0RW5kcG9pbnQ6IFwiL2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb25cIixcbiAgICAgICAgb3JkZXJFbmRwb2ludDogXCIvYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uXCIsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5vcHRzKX0hYCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgcmVhZHkgdG8gc3RhcnQgY2FsbGluZyBBUEkuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGlzUmVhZHlUb1N0YXJ0KCkge1xuICAgIHZhciBpc1JlYWR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWAuXG4gICAqL1xuICByZWdpc3Rlck9wdGlvbnMoKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2Jhc2VVcmwnKSB7XG4gICAgICAvLyBJbml0IEJhc2UgVVJMIGZvciB0ZXN0aW5nXG4gICAgICB0aGlzLmxvZygnQmFzZSBVUkwgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5vcHRzLmJhc2VVcmwgPSBhcmd1bWVudHNbMV07IC8vIG92ZXJyaWRlXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdwcm9kdWN0Jykge1xuICAgICAgLy8gSW5pdCBQcm9kdWN0IG9iamVjdFxuICAgICAgdGhpcy5sb2coJ1Byb2R1Y3QgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5wcm9kdWN0ID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnb3JkZXInKSB7XG4gICAgICAvLyBJbml0IE9yZGVyIG9iamVjdFxuICAgICAgdGhpcy5sb2coJ09yZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMub3JkZXIgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdzdG9yZScpIHtcbiAgICAgIC8vIEluaXQgc3RvcmUgc2x1Z1xuICAgICAgdGhpcy5sb2coJ1N0b3JlIHNsdWcgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5zbHVnID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAvLyBJbml0IHVzZXIgYmFzZWQgcmVjb21tZW5kYXRpb25zXG4gICAgICB0aGlzLmxvZygnQ3VzdG9tZXJfaWQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jdXN0b21lcklkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY2F0ZWdvcnknKSB7XG4gICAgICAvLyBJbml0IGNhdGVnb3J5XG4gICAgICB0aGlzLmxvZygnQ2F0ZWdvcnkgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jYXRlZ29yeU5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdicmFuZCcpIHtcbiAgICAgIC8vIEluaXQgYnJhbmRcbiAgICAgIHRoaXMubG9nKCdCcmFuZCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmJyYW5kbmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Byb2R1Y3RJZCcpIHtcbiAgICAgIC8vIEluaXQgcHJvZHVjdCBpZFxuICAgICAgdGhpcy5sb2coJ1Byb2R1Y3QgSUQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5wcm9kdWN0SWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdnZW5kZXInKSB7XG4gICAgICAvLyBJbml0IGdlbmRlclxuICAgICAgdGhpcy5sb2coJ0dlbmRlciBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmdlbmRlciA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Nlc3Npb24nKSB7XG4gICAgICAvLyBJbml0IHNlc3Npb25cbiAgICAgIHRoaXMubG9nKCdTZXNzaW9uIGlzJywgYXJndW1lbnRzWzFdKVxuICAgICAgdGhpcy5zZXNzaW9uSWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMubG9nKCdMYW5ndWFnZSBpcycsIGFyZ3VtZW50c1sxXSlcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNZXRpc2E7XG4iLCJ2YXIgTWV0aXNhQ29yZSA9IHJlcXVpcmUoJy4uL2NvcmUnKTtcbnZhciB3aXRoSUZyYW1lID0gcmVxdWlyZSgnLi93aXRoSUZyYW1lJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcbnZhciBjb21wb3NlID0gdXRpbC5jb21wb3NlO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2Mge0BsaW5rIE1ldGlzYX0gY2xhc3MgdGhhdCBjb21wb3NlcyB3aXRoIHtAbGluayBjb21wb3NlQ2xhc3MuSUZyYW1lfVxuICogQHJlcXVpcmVzIE1ldGlzYVxuICogQHJlcXVpcmVzIGNvbXBvc2VDbGFzc1xuICogQHJlcXVpcmVzIGdldFV0aWwuY29tcG9zZVxuICovXG52YXIgTWV0aXNhd2l0aElGcmFtZSA9IGNvbXBvc2UoTWV0aXNhQ29yZSkod2l0aElGcmFtZSk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciBicm93c2VyIGVudmlyb25tZW50LiBUaGlzIGlzIGluaXRpYWxpc2VkIGFuZCBleHBvc2VkIHRvIGB3aW5kb3cuTWV0aXNhYCB3aGVuIHlvdSBpbXBvcnQgdGhyb3VnaCBvdXIgW2V4YW1wbGVdKC8jaW5zdGFsbGF0aW9uKS5cbiAqIEBleHRlbmRzIE1ldGlzYXdpdGhJRnJhbWVcbiAqL1xuY2xhc3MgTWV0aXNhRG9tIGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBNZXRpc2FEb21gIHdpdGggYG9wdHNgLlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhRG9tIGNvbnRydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBpZiAoJCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdNZXRpc2EgRG9tIHJlcXVpcmVzIGpRdWVyeSB0byBiZSBhdmFpbGFibGUhJylcbiAgICB9XG4gICAgc3VwZXIob3B0cyk7XG5cbiAgICBjb25zb2xlLmxvZyhgaW5pdGlhbGlzZWQgTWV0aXNhIERvbSB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5vcHRzKX0hYCk7XG4gICAgdGhpcy5yZW5kZXJXaWRnZXQgPSB0aGlzLnJlbmRlcldpZGdldC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJPcHRpb25zID0gdGhpcy5yZWdpc3Rlck9wdGlvbnMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuYXR0YWNoUmVnaXN0ZXJPcHRpb25zVG9XaW5kb3coKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyByZWdpc3RlcmVkIG9wdGlvbnMgdG8gYHdpbmRvdy5tdGAuXG4gICAqL1xuICBhdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpIHtcbiAgICB3aW5kb3cubXQgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgb3B0aW9ucyBmcm9tIGBtdCgne3sgb3B0aW9uIH19Jywge3sgdmFsdWUgfX0pYGFuZCBkZXRlcm1pbmVzIHdoZXRoZXIgcHJvZHVjdCBvciBvcmRlciBkYXRhIHNob3VsZCBiZSBoYW5kbGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xuICAgIHN1cGVyLnJlZ2lzdGVyT3B0aW9ucy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNSZWFkeVRvU3RhcnQpIHtcbiAgICAgIHRoaXMucmVuZGVyV2lkZ2V0KCk7XG4gICAgICBpZiAodGhpcy5wcm9kdWN0KSB7XG4gICAgICAgIHRoaXMudHJhY2soJ3Byb2R1Y3QnLCB0aGlzLnByb2R1Y3QpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLm9yZGVyKSB7XG4gICAgICAgIHRoaXMudHJhY2soJ29yZGVyJywgdGhpcy5vcmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgTWV0aXNhIHdpZGdldHMgaW4gdGhlIGJyb3dzZXIuXG4gICAqL1xuICByZW5kZXJXaWRnZXQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgd2lkZ2V0cyA9ICQoJy5tdC13aWRnZXQnKTtcblxuICAgIC8vIENvbnZlcnQgd2lkZ2V0cyBub2RlbGlzdCB0byB0cnVlIGFycmF5XG4gICAgd2lkZ2V0cyA9ICQubWFrZUFycmF5KHdpZGdldHMpO1xuXG4gICAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHdpZGdldCkge1xuICAgICAgLy8gUmVuZGVyIHdpZGdldCB1c2luZyBBamF4IHNvIHdlIGNhbiBncmFjZWZ1bGx5IGRlZ3JhZGUgaWYgdGhlcmUgaXMgbm8gY29udGVudCBhdmFpbGFibGVcbiAgICAgIHZhciB3aWRnZXRJZCA9IHdpZGdldC5kYXRhc2V0LndpZGdldElkLFxuICAgICAgICBjdXN0b21lcklkID0gd2lkZ2V0LmRhdGFzZXQuY3VzdG9tZXJJZCxcbiAgICAgICAgcHJvZHVjdElkID0gd2lkZ2V0LmRhdGFzZXQucHJvZHVjdElkLFxuICAgICAgICBjYXRlZ29yeU5hbWUgPSB3aWRnZXQuZGF0YXNldC5jYXRlZ29yeU5hbWUsXG4gICAgICAgIGJyYW5kbmFtZSA9IHdpZGdldC5kYXRhc2V0LmJyYW5kbmFtZSxcbiAgICAgICAgc2Vzc2lvbklkID0gd2lkZ2V0LmRhdGFzZXQuc2Vzc2lvbklkLFxuICAgICAgICBsYW5ndWFnZSA9IHdpZGdldC5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArICcvYXBpL3YxL3dpZGdldC1jdXN0b21lcj93aWRnZXRfaWQ9JyArIHdpZGdldElkO1xuXG4gICAgICAvLyBPdmVycmlkZSBjdXN0b21lciwgY2F0ZWdvcnkgb3IgYnJhbmRcbiAgICAgIGlmIChjdXN0b21lcklkKSB0aGlzLmN1c3RvbWVySWQgPSBjdXN0b21lcklkO1xuICAgICAgaWYgKHByb2R1Y3RJZCkgdGhpcy5wcm9kdWN0SWQgPSBwcm9kdWN0SWQ7XG4gICAgICBpZiAoY2F0ZWdvcnlOYW1lKSB0aGlzLmNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5TmFtZTtcbiAgICAgIGlmIChicmFuZG5hbWUpIHRoaXMuYnJhbmRuYW1lID0gYnJhbmRuYW1lO1xuICAgICAgaWYgKHNlc3Npb25JZCkgdGhpcy5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgICBpZiAobGFuZ3VhZ2UpIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcblxuICAgICAgaWYgKHRoaXMuY3VzdG9tZXJJZCkge1xuICAgICAgICB1cmwgKz0gJyZjdXN0b21lcl9pZD0nICsgZXNjYXBlKHRoaXMuY3VzdG9tZXJJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnByb2R1Y3RJZCkge1xuICAgICAgICB1cmwgKz0gJyZwcm9kdWN0X2lkPScgKyBlc2NhcGUodGhpcy5wcm9kdWN0SWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jYXRlZ29yeU5hbWUpIHtcbiAgICAgICAgdXJsICs9ICcmY2F0ZWdvcnlfbmFtZT0nICsgZXNjYXBlKHRoaXMuY2F0ZWdvcnlOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYnJhbmRuYW1lKSB7XG4gICAgICAgIHVybCArPSAnJmJyYW5kbmFtZT0nICsgZXNjYXBlKHRoaXMuYnJhbmRuYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZ2VuZGVyKSB7XG4gICAgICAgIHVybCArPSAnJmdlbmRlcj0nICsgZXNjYXBlKHRoaXMuZ2VuZGVyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2Vzc2lvbklkKSB7XG4gICAgICAgIHVybCArPSAnJnNlc3Npb25faWQ9JyArIGVzY2FwZSh0aGlzLnNlc3Npb25JZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmxhbmd1YWdlKSB7XG4gICAgICAgIHVybCArPSAnJmxhbmd1YWdlPScgKyBlc2NhcGUodGhpcy5sYW5ndWFnZSk7XG4gICAgICB9XG5cbiAgICAgIHVybCArPSAnJmZvcm1hdD1odG1sJztcbiAgICAgIC8vIFByZXBhcmUgaWZyYW1lXG4gICAgICB2YXIgaWZyYW1lID0gc2VsZi5jcmVhdGVJRnJhbWVXaXRoSWQod2lkZ2V0SWQpO1xuXG4gICAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgICAgLy8gUmVuZGVyIGxvYWRlclxuICAgICAgdmFyIGh0bWwgPSBzZWxmLmdldExvYWRlckhUTUwoKTtcblxuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQub3BlbigpO1xuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoaHRtbCk7XG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgIH0pXG4gICAgICAuZG9uZShmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgLy8gRGVsZXRlIGxvYWRlciBpZnJhbWVcbiAgICAgICAgdmFyIG9sZElGcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aWRnZXQtJyArXG4gICAgICAgIHdpZGdldElkKTtcblxuICAgICAgICB2YXIgaWZyYW1lUGFyZW50ID0gb2xkSUZyYW1lLnBhcmVudE5vZGU7XG5cbiAgICAgICAgaWYgKGlmcmFtZVBhcmVudCkge1xuICAgICAgICAgIHdoaWxlIChpZnJhbWVQYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgaWZyYW1lUGFyZW50LnJlbW92ZUNoaWxkKGlmcmFtZVBhcmVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgaWZyYW1lIGZvciB3aWRnZXRcbiAgICAgICAgdmFyIGlmcmFtZSA9IHNlbGYuY3JlYXRlSUZyYW1lV2l0aElkKHdpZGdldElkKTtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHdpZGdldC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgICAgICAgdmFyIGh0bWwgPSBzZWxmLmRlY29kZUh0bWxFbnRpdGllcyhkYXRhKTtcblxuICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShodG1sKTtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmNsb3NlKCk7XG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMzBweCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEh0bWwgd2lsbCBiZSBlbXB0eSBpZiBzdG9yZSBoYXMgcnVuIG91dCBvZiBmcmVlIHNhbGVzIGNyZWRpdHMuXG4gICAgICAgICAgICAvLyBHcmFjZWZ1bGx5IGZhaWwgdG8gbG9hZCB3aWRnZXQgYnkgcmVtb3ZpbmcgdGhlIGlmcmFtZSBmcm9tIERPTS5cbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIHN0YXR1c1RleHQpO1xuICAgICAgICAgIC8vIFJlbW92ZSBpZnJhbWUgZnJvbSBET01cbiAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG4gIC8qKlxuICAgKiBTdGFydHMgdHJhY2tpbmcgYnkgc3VibWl0dGluZyBwcm9kdWN0IG9yIG9yZGVyIGRhdGEgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhdCBDYXRlZ29yeSBuYW1lIG9mIGRhdGEgKGFsbG93ZWQgdmFsdWVzOiBgXCJwcm9kdWN0XCJgLGBcIm9yZGVyXCJgKVxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBPYmplY3Qgb2YgcHJvZHVjdCBvciBvcmRlciBkYXRhXG4gICAqL1xuXG4gIHRyYWNrKGNhdCwgZGF0YSkge1xuICAgIGlmICh0aGlzLnNsdWcpIHtcbiAgICAgIGlmIChjYXQgPT09ICdwcm9kdWN0Jykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlUHJvZHVjdChkYXRhKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNhdCA9PT0gJ29yZGVyJykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlT3JkZXIoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcm9kdWN0IGlmIGl0IGRvZXMgbm90IGV4aXN0IGluIE1ldGlzYSBvciB1cGRhdGVzIHRoZSBwcm9kdWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvZHVjdERhdGEgW3Byb2R1Y3REYXRhXXtAbGluayBCUk9XU0VSL1NDSEVNQS5odG1sI3Byb2R1Y3QtZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgcHJvZHVjdCBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlUHJvZHVjdChkYXRhKSB7XG4gICAgdmFyIHVybCA9IHRoaXMub3B0cy5iYXNlVXJsICsgdGhpcy5zbHVnICsgdGhpcy5vcHRzLnByb2R1Y3RFbmRwb2ludDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIH0sXG4gICAgICBzdGF0dXNDb2RlOiB7XG4gICAgICAgICAgNTAwOiBmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ludGVybmFsIHNlcnZlciBlcnJvcicpO1xuICAgICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzJyk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgeGhyKTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5yZXNwb25zZUpTT04pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3JkZXIgaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIG9yZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JkZXJEYXRhIFtvcmRlckRhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjb3JkZXItZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgb3JkZXIgQVBJIGVuZHBvaW50XG4gICAqL1xuICBjcmVhdGVPclVwZGF0ZU9yZGVyKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMub3JkZXJFbmRwb2ludDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIH0sXG4gICAgICBzdGF0dXNDb2RlOiB7XG4gICAgICAgICAgNTAwOiBmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ludGVybmFsIHNlcnZlciBlcnJvcicpO1xuICAgICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzJyk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgeGhyKTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5yZXNwb25zZUpTT04pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlcyBsb2dzIHRvIGJyb3dzZXIgY29uc29sZSB3aGVuIGBkZWJ1Z2AgcHJvcGVydHkgb2YgYE1ldGlzYURvbWAgb2JqZWN0IGlzIGB0cnVlYFxuICAgKi9cbiAgbG9nKCkge1xuICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0aXNhRG9tO1xuIiwiLyoqXG4gKiBSZXR1cm5zIHtAbGluayBjb21wb3NlQ2xhc3MuSUZyYW1lfSBjb21wb3NlZCB3aXRoIGBjb21wb3NlZENsYXNzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtICB7Y2xhc3N9IGBjb21wb3NlZENsYXNzYCB0byBiZSBjb21wb3NlZC5cbiAqIEByZXR1cm5zIHtjb21wb3NlZENsYXNzLklGcmFtZX1cbiAqL1xuXG52YXIgY29tcG9zZUNsYXNzID0gZnVuY3Rpb24oY29tcG9zZWRDbGFzcykge1xuICAvKipcbiAgICogYDxpZnJhbWU+YCBlbGVtZW50IGluIHRoZSByZWNvbW1lbmRhdGlvbiB3aWRnZXQuXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IElGcmFtZVxuICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzXG4gICAqL1xuICByZXR1cm4gY2xhc3MgSUZyYW1lIGV4dGVuZHMgY29tcG9zZWRDbGFzcyB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgaWZyYW1lYCBlbGVtZW50XG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgUmVjb21tZW5kYXRpb24gd2lkZ2V0IElEXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIGNyZWF0ZUlGcmFtZVdpdGhJZChpZCkge1xuICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsICdib3JkZXI6IDBweDsgd2lkdGg6IDEwMCU7Jyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdmcmFtZWJvcmRlcicsICcwJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzY3JvbGxpbmcnLCAnbm8nKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ29ubG9hZCcsICd3aW5kb3cuTWV0aXNhLnJlc2l6ZUlmcmFtZSh0aGlzKScpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2lkZ2V0LScgKyBpZCk7XG5cbiAgICAgIHJldHVybiBpZnJhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyBgaWZyYW1lYCBlbGVtZW50XG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogYGlmcmFtZWAgZWxlbWVudCB0byBiZSByZXNpemVkLlxuICAgICAqL1xuICAgIHJlc2l6ZUlmcmFtZShvYmopIHtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgb2JqLnN0eWxlLmhlaWdodCA9IG9iai5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGxvYWRlciBIVE1MXG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExvYWRlckhUTUwoKSB7XG4gICAgICByZXR1cm4gJzwhZG9jdHlwZSBodG1sPjxodG1sPjxzdHlsZT5ib2R5e2hlaWdodDogMTAwcHg7fS5jcy1sb2FkZXJ7aGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTt9LmNzLWxvYWRlci1pbm5lcnt0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7IHRvcDogNTAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiBjYWxjKDEwMCUgLSAyMDBweCk7IGNvbG9yOiAjQTJBM0EzOyBwYWRkaW5nOiAwIDEwMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWx7Zm9udC1zaXplOiAyMHB4OyBvcGFjaXR5OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fUBrZXlmcmFtZXMgbG9sezAle29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9MTAwJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319QC13ZWJraXQta2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9NjYle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNil7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDUpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg0KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMyl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDIpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgNDAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgxKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9PC9zdHlsZT48Ym9keT4gPGRpdiBjbGFzcz1cImNzLWxvYWRlclwiPiA8ZGl2IGNsYXNzPVwiY3MtbG9hZGVyLWlubmVyXCI+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRlY29kZWQgSFRNTCBlbnRpdGllc1xuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBIVE1MIGVudGl0aWVzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBkZWNvZGVIdG1sRW50aXRpZXMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyYjPyhcXHcrKTsvZywgZnVuY3Rpb24obWF0Y2gsIGRlYykge1xuICAgICAgICBpZiAoaXNOYU4oZGVjKSkge1xuICAgICAgICAgIHZhciBjaGFycyA9IHtcbiAgICAgICAgICAgIHF1b3Q6IDM0LFxuICAgICAgICAgICAgYW1wOiAzOCxcbiAgICAgICAgICAgIGx0OiA2MCxcbiAgICAgICAgICAgIGd0OiA2MixcbiAgICAgICAgICAgIG5ic3A6IDE2MCxcbiAgICAgICAgICAgIGNvcHk6IDE2OSxcbiAgICAgICAgICAgIHJlZzogMTc0LFxuICAgICAgICAgICAgZGVnOiAxNzYsXG4gICAgICAgICAgICBmcmFzbDogNDcsXG4gICAgICAgICAgICB0cmFkZTogODQ4MixcbiAgICAgICAgICAgIGV1cm86IDgzNjQsXG4gICAgICAgICAgICBBZ3JhdmU6IDE5MixcbiAgICAgICAgICAgIEFhY3V0ZTogMTkzLFxuICAgICAgICAgICAgQWNpcmM6IDE5NCxcbiAgICAgICAgICAgIEF0aWxkZTogMTk1LFxuICAgICAgICAgICAgQXVtbDogMTk2LFxuICAgICAgICAgICAgQXJpbmc6IDE5NyxcbiAgICAgICAgICAgIEFFbGlnOiAxOTgsXG4gICAgICAgICAgICBDY2VkaWw6IDE5OSxcbiAgICAgICAgICAgIEVncmF2ZTogMjAwLFxuICAgICAgICAgICAgRWFjdXRlOiAyMDEsXG4gICAgICAgICAgICBFY2lyYzogMjAyLFxuICAgICAgICAgICAgRXVtbDogMjAzLFxuICAgICAgICAgICAgSWdyYXZlOiAyMDQsXG4gICAgICAgICAgICBJYWN1dGU6IDIwNSxcbiAgICAgICAgICAgIEljaXJjOiAyMDYsXG4gICAgICAgICAgICBJdW1sOiAyMDcsXG4gICAgICAgICAgICBFVEg6IDIwOCxcbiAgICAgICAgICAgIE50aWxkZTogMjA5LFxuICAgICAgICAgICAgT2dyYXZlOiAyMTAsXG4gICAgICAgICAgICBPYWN1dGU6IDIxMSxcbiAgICAgICAgICAgIE9jaXJjOiAyMTIsXG4gICAgICAgICAgICBPdGlsZGU6IDIxMyxcbiAgICAgICAgICAgIE91bWw6IDIxNCxcbiAgICAgICAgICAgIHRpbWVzOiAyMTUsXG4gICAgICAgICAgICBPc2xhc2g6IDIxNixcbiAgICAgICAgICAgIFVncmF2ZTogMjE3LFxuICAgICAgICAgICAgVWFjdXRlOiAyMTgsXG4gICAgICAgICAgICBVY2lyYzogMjE5LFxuICAgICAgICAgICAgVXVtbDogMjIwLFxuICAgICAgICAgICAgWWFjdXRlOiAyMjEsXG4gICAgICAgICAgICBUSE9STjogMjIyLFxuICAgICAgICAgICAgc3psaWc6IDIyMyxcbiAgICAgICAgICAgIGFncmF2ZTogMjI0LFxuICAgICAgICAgICAgYWFjdXRlOiAyMjUsXG4gICAgICAgICAgICBhY2lyYzogMjI2LFxuICAgICAgICAgICAgYXRpbGRlOiAyMjcsXG4gICAgICAgICAgICBhdW1sOiAyMjgsXG4gICAgICAgICAgICBhcmluZzogMjI5LFxuICAgICAgICAgICAgYWVsaWc6IDIzMCxcbiAgICAgICAgICAgIGNjZWRpbDogMjMxLFxuICAgICAgICAgICAgZWdyYXZlOiAyMzIsXG4gICAgICAgICAgICBlYWN1dGU6IDIzMyxcbiAgICAgICAgICAgIGVjaXJjOiAyMzQsXG4gICAgICAgICAgICBldW1sOiAyMzUsXG4gICAgICAgICAgICBpZ3JhdmU6IDIzNixcbiAgICAgICAgICAgIGlhY3V0ZTogMjM3LFxuICAgICAgICAgICAgaWNpcmM6IDIzOCxcbiAgICAgICAgICAgIGl1bWw6IDIzOSxcbiAgICAgICAgICAgIGV0aDogMjQwLFxuICAgICAgICAgICAgbnRpbGRlOiAyNDEsXG4gICAgICAgICAgICBvZ3JhdmU6IDI0MixcbiAgICAgICAgICAgIG9hY3V0ZTogMjQzLFxuICAgICAgICAgICAgb2NpcmM6IDI0NCxcbiAgICAgICAgICAgIG90aWxkZTogMjQ1LFxuICAgICAgICAgICAgb3VtbDogMjQ2LFxuICAgICAgICAgICAgZGl2aWRlOiAyNDcsXG4gICAgICAgICAgICBvc2xhc2g6IDI0OCxcbiAgICAgICAgICAgIHVncmF2ZTogMjQ5LFxuICAgICAgICAgICAgdWFjdXRlOiAyNTAsXG4gICAgICAgICAgICB1Y2lyYzogMjUxLFxuICAgICAgICAgICAgdXVtbDogMjUyLFxuICAgICAgICAgICAgeWFjdXRlOiAyNTMsXG4gICAgICAgICAgICB0aG9ybjogMjU0LFxuICAgICAgICAgICAgeXVtbDogMjU1LFxuICAgICAgICAgICAgbHNxdW86IDgyMTYsXG4gICAgICAgICAgICByc3F1bzogODIxNyxcbiAgICAgICAgICAgIHNicXVvOiA4MjE4LFxuICAgICAgICAgICAgbGRxdW86IDgyMjAsXG4gICAgICAgICAgICByZHF1bzogODIyMSxcbiAgICAgICAgICAgIGJkcXVvOiA4MjIyLFxuICAgICAgICAgICAgZGFnZ2VyOiA4MjI0LFxuICAgICAgICAgICAgRGFnZ2VyOiA4MjI1LFxuICAgICAgICAgICAgcGVybWlsOiA4MjQwLFxuICAgICAgICAgICAgbHNhcXVvOiA4MjQ5LFxuICAgICAgICAgICAgcnNhcXVvOiA4MjUwLFxuICAgICAgICAgICAgc3BhZGVzOiA5ODI0LFxuICAgICAgICAgICAgY2x1YnM6IDk4MjcsXG4gICAgICAgICAgICBoZWFydHM6IDk4MjksXG4gICAgICAgICAgICBkaWFtczogOTgzMCxcbiAgICAgICAgICAgIG9saW5lOiA4MjU0LFxuICAgICAgICAgICAgbGFycjogODU5MixcbiAgICAgICAgICAgIHVhcnI6IDg1OTMsXG4gICAgICAgICAgICByYXJyOiA4NTk0LFxuICAgICAgICAgICAgZGFycjogODU5NSxcbiAgICAgICAgICAgIGhlbGxpcDogMTMzLFxuICAgICAgICAgICAgbmRhc2g6IDE1MCxcbiAgICAgICAgICAgIG1kYXNoOiAxNTEsXG4gICAgICAgICAgICBpZXhjbDogMTYxLFxuICAgICAgICAgICAgY2VudDogMTYyLFxuICAgICAgICAgICAgcG91bmQ6IDE2MyxcbiAgICAgICAgICAgIGN1cnJlbjogMTY0LFxuICAgICAgICAgICAgeWVuOiAxNjUsXG4gICAgICAgICAgICBicnZiYXI6IDE2NixcbiAgICAgICAgICAgIGJya2JhcjogMTY2LFxuICAgICAgICAgICAgc2VjdDogMTY3LFxuICAgICAgICAgICAgdW1sOiAxNjgsXG4gICAgICAgICAgICBkaWU6IDE2OCxcbiAgICAgICAgICAgIG9yZGY6IDE3MCxcbiAgICAgICAgICAgIGxhcXVvOiAxNzEsXG4gICAgICAgICAgICBub3Q6IDE3MixcbiAgICAgICAgICAgIHNoeTogMTczLFxuICAgICAgICAgICAgbWFjcjogMTc1LFxuICAgICAgICAgICAgaGliYXI6IDE3NSxcbiAgICAgICAgICAgIHBsdXNtbjogMTc3LFxuICAgICAgICAgICAgc3VwMjogMTc4LFxuICAgICAgICAgICAgc3VwMzogMTc5LFxuICAgICAgICAgICAgYWN1dGU6IDE4MCxcbiAgICAgICAgICAgIG1pY3JvOiAxODEsXG4gICAgICAgICAgICBwYXJhOiAxODIsXG4gICAgICAgICAgICBtaWRkb3Q6IDE4MyxcbiAgICAgICAgICAgIGNlZGlsOiAxODQsXG4gICAgICAgICAgICBzdXAxOiAxODUsXG4gICAgICAgICAgICBvcmRtOiAxODYsXG4gICAgICAgICAgICByYXF1bzogMTg3LFxuICAgICAgICAgICAgZnJhYzE0OiAxODgsXG4gICAgICAgICAgICBmcmFjMTI6IDE4OSxcbiAgICAgICAgICAgIGZyYWMzNDogMTkwLFxuICAgICAgICAgICAgaXF1ZXN0OiAxOTEsXG4gICAgICAgICAgICBBbHBoYTogOTEzLFxuICAgICAgICAgICAgYWxwaGE6IDk0NSxcbiAgICAgICAgICAgIEJldGE6IDkxNCxcbiAgICAgICAgICAgIGJldGE6IDk0NixcbiAgICAgICAgICAgIEdhbW1hOiA5MTUsXG4gICAgICAgICAgICBnYW1tYTogOTQ3LFxuICAgICAgICAgICAgRGVsdGE6IDkxNixcbiAgICAgICAgICAgIGRlbHRhOiA5NDgsXG4gICAgICAgICAgICBFcHNpbG9uOiA5MTcsXG4gICAgICAgICAgICBlcHNpbG9uOiA5NDksXG4gICAgICAgICAgICBaZXRhOiA5MTgsXG4gICAgICAgICAgICB6ZXRhOiA5NTAsXG4gICAgICAgICAgICBFdGE6IDkxOSxcbiAgICAgICAgICAgIGV0YTogOTUxLFxuICAgICAgICAgICAgVGhldGE6IDkyMCxcbiAgICAgICAgICAgIHRoZXRhOiA5NTIsXG4gICAgICAgICAgICBJb3RhOiA5MjEsXG4gICAgICAgICAgICBpb3RhOiA5NTMsXG4gICAgICAgICAgICBLYXBwYTogOTIyLFxuICAgICAgICAgICAga2FwcGE6IDk1NCxcbiAgICAgICAgICAgIExhbWJkYTogOTIzLFxuICAgICAgICAgICAgbGFtYmRhOiA5NTUsXG4gICAgICAgICAgICBNdTogOTI0LFxuICAgICAgICAgICAgbXU6IDk1NixcbiAgICAgICAgICAgIE51OiA5MjUsXG4gICAgICAgICAgICBudTogOTU3LFxuICAgICAgICAgICAgWGk6IDkyNixcbiAgICAgICAgICAgIHhpOiA5NTgsXG4gICAgICAgICAgICBPbWljcm9uOiA5MjcsXG4gICAgICAgICAgICBvbWljcm9uOiA5NTksXG4gICAgICAgICAgICBQaTogOTI4LFxuICAgICAgICAgICAgcGk6IDk2MCxcbiAgICAgICAgICAgIFJobzogOTI5LFxuICAgICAgICAgICAgcmhvOiA5NjEsXG4gICAgICAgICAgICBTaWdtYTogOTMxLFxuICAgICAgICAgICAgc2lnbWE6IDk2MyxcbiAgICAgICAgICAgIFRhdTogOTMyLFxuICAgICAgICAgICAgdGF1OiA5NjQsXG4gICAgICAgICAgICBVcHNpbG9uOiA5MzMsXG4gICAgICAgICAgICB1cHNpbG9uOiA5NjUsXG4gICAgICAgICAgICBQaGk6IDkzNCxcbiAgICAgICAgICAgIHBoaTogOTY2LFxuICAgICAgICAgICAgQ2hpOiA5MzUsXG4gICAgICAgICAgICBjaGk6IDk2NyxcbiAgICAgICAgICAgIFBzaTogOTM2LFxuICAgICAgICAgICAgcHNpOiA5NjgsXG4gICAgICAgICAgICBPbWVnYTogOTM3LFxuICAgICAgICAgICAgb21lZ2E6IDk2OVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoY2hhcnNbZGVjXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkZWMgPSBjaGFyc1tkZWNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShkZWMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlQ2xhc3M7XG4iLCJjb25zdCBNZXRpc2FEb20gPSByZXF1aXJlKCcuL01ldGlzYS9kb20nKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuXG4vKipcbiAqIExvYWRzIGpRdWVyeSBhbmQge0BsaW5rIE1ldGlzYURvbX0gb2JqZWN0IGludG8gd2luZG93IG9iamVjdCBpbiBicm93c2VyXG4gKiBAcHJpdmF0ZVxuICogQHJlcXVpcmVzIE1ldGlzYURvbVxuICogQHJlcXVpcmVzIGdldFV0aWxcbiAqL1xuZnVuY3Rpb24gYnJvd3NlcigpIHtcbiAgaWYgKHV0aWwuZW52aXJvbm1lbnQgIT09ICdicm93c2VyJyApIHtcbiAgICByZXR1cm4gY29uc29sZS53YXJuKCdNZXRpc2EgYnJvd3NlciBjYW4gb25seSBydW4gaW5zaWRlIGEgYnJvd3NlcicpO1xuICB9XG4gIHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9ICQgfHwgalF1ZXJ5IHx8IHt9O1xuXG4gIHdpbmRvdy5NZXRpc2EgPSBuZXcgTWV0aXNhRG9tKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKGJyb3dzZXIpKCk7XG4iLCIvKipcbiAqIEdldHMgU0RLIHV0aWxpdGllc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7VXRpbE9ian1cbiAqL1xuZnVuY3Rpb24gZ2V0VXRpbCgpIHtcbiAgLyoqXG4gICAqIE9iamVjdCBjb250YWluaW5nIHV0aWxpbGl0aWVzXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IFV0aWxPYmpcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVudmlyb25tZW50IEVudmlyb25tZW50IHRoYXQgTWV0aXNhIG9iamVjdCBpcyBleHBvc2VkIHRvLiBSZXR1cm5zIGAnYnJvd3NlcidgIG9yIGBub2RlYC5cbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gY29tcG9zZSBbRnVuY3Rpb25dKCNnZXR1dGlsY29tcG9zZWZ1bmNvcmlnaW5hbC3ih5ItY2xhc3MpIGZvciBjb21wb3NpbmcgY2xhc3Nlc1xuICAgKiBAbWVtYmVyb2YgZ2V0VXRpbFxuICAgKi9cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wb3NlZCBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtICB7Y2xhc3N9IG9yaWdpbmFsIENsYXNzIHRvIGJlIGNvbXBvc2VkIHRvLlxuICAgKiBAcmV0dXJuIHtjbGFzc31cbiAgICovXG4gIHZhciBjb21wb3NlRnVuYyA9IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY29tcG9zaXRpb25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBjb21wb3NlZCA9IG9yaWdpbmFsO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29tcG9zZWQgPSBjb21wb3NpdGlvbnNbaV0oY29tcG9zZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbXBvc2VkO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBlbnZpcm9ubWVudDogdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyAnYnJvd3NlcicgOiAnbm9kZScsXG4gICAgY29tcG9zZTogY29tcG9zZUZ1bmMsXG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IChnZXRVdGlsKSgpO1xuIl19
