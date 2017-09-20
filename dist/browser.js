(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Options object definition
 * @private
 * @typedef {Object} Opts
 * @property {string} baseUrl=https://askmetisa.com/ Base URL of API
 * @property {string} productEndpoint=/api/v1/product-collection Path of API endpoint for creating or updating products
 * @property {string} orderEndpoint=/api/v1/order-transaction Path of API endpoint for creating or updating orders
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
        productEndpoint: "/api/v1/product-collection",
        orderEndpoint: "/api/v1/order-transaction",
      },
      opts
    );
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
    } else if (arguments[0] === 'product') {
      // Init Product object
      this.log('Product is', arguments[1]);
      this.product = arguments[1];
    } else if (arguments[0] === 'order') {
      // Init Order object
      this.log('Order is', arguments[1]);
      this.order = arguments[1];
    } else if (arguments[0] === 'store') {
      // Init store slug
      this.log('Store slug is', arguments[1]);
      this.slug = arguments[1];
    } else if (arguments[0] === 'customer') {
      // Init user based recommendations
      this.log('Customer_id is', arguments[1]);
      this.customerId = arguments[1];
    } else if (arguments[0] === 'category') {
      // Init category
      this.log('Category is', arguments[1]);
      this.categoryName = arguments[1];
    } else if (arguments[0] === 'brand') {
      // Init brand
      this.log('Brand is', arguments[1]);
      this.brandname = arguments[1];
    } else if (arguments[0] === 'productId') {
      // Init product id
      this.log('Product ID is', arguments[1]);
      this.productId = arguments[1];
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
   * Registers options from `mt('{{ option }}', {{ value }})`and determines whether product or order data should be handled.
   */
  registerOptions() {
    super.registerOptions.apply(this, arguments);

    if (this.isReadyToStart) {
      this.renderWidget();
      if (this.product) {
        this.track('product', this.product);
      }
      else if(this.order) {
        this.track('order', this.order);
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
        customerId = widget.dataset.customerId,
        productId = widget.dataset.productId,
        categoryName = widget.dataset.categoryName,
        brandname = widget.dataset.brandname,
        sessionId = widget.dataset.sessionId,
        language = widget.dataset.language,
        url = this.opts.baseUrl + this.slug + '/api/v1/widget-customer?widget_id=' + widgetId;

      // Override customer, category or brand
      if (customerId) this.customerId = customerId;
      if (productId) this.productId = productId;
      if (categoryName) this.categoryName = categoryName;
      if (brandname) this.brandname = brandname;
      if (sessionId) this.sessionId = sessionId;
      if (language) this.language = language;

      if (this.customerId) {
        url += '&customer_id=' + escape(this.customerId);
      }

      if (this.productId) {
        url += '&product_id=' + escape(this.productId);
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
   * Starts tracking by submitting product or order data to the API.
   * @param {string} cat Category name of data (allowed values: `"product"`,`"order"`)
   * @param {object} data Object of product or order data
   */

  track(cat, data) {
    if (this.slug) {
      if (cat === 'product') {
        this.createOrUpdateProduct(data);
      }
      else if (cat === 'order') {
        this.createOrUpdateOrder(data);
      }
    }
  }

  /**
   * Creates a product if it does not exist in Metisa or updates the product.
   * @param {Object} productData [productData]{@link BROWSER/SCHEMA.html#product-data} object to be submitted to the product API endpoint
   */
  createOrUpdateProduct(data) {
    var url = this.opts.baseUrl + this.slug + this.opts.productEndpoint;
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
   * Creates an order if it does not exist in Metisa or updates the order.
   * @param {Object} orderData [orderData]{@link BROWSER/SCHEMA.html#order-data} object to be submitted to the order API endpoint
   */
  createOrUpdateOrder(data) {
    var url = this.opts.baseUrl + this.slug + this.opts.orderEndpoint;
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
   * Writes logs to browser console when `debug` property of `MetisaDom` object is `true`
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
 * @returns {composedClass.IFrame}
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
   * @property {function} compose [Function](#getutilcomposefuncoriginal-⇒-class) for composing classes
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIE9wdGlvbnMgb2JqZWN0IGRlZmluaXRpb25cbiAqIEBwcml2YXRlXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBPcHRzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmFzZVVybD1odHRwczovL2Fza21ldGlzYS5jb20vIEJhc2UgVVJMIG9mIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHByb2R1Y3RFbmRwb2ludD0vYXBpL3YxL3Byb2R1Y3QtY29sbGVjdGlvbiBQYXRoIG9mIEFQSSBlbmRwb2ludCBmb3IgY3JlYXRpbmcgb3IgdXBkYXRpbmcgcHJvZHVjdHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBvcmRlckVuZHBvaW50PS9hcGkvdjEvb3JkZXItdHJhbnNhY3Rpb24gUGF0aCBvZiBBUEkgZW5kcG9pbnQgZm9yIGNyZWF0aW5nIG9yIHVwZGF0aW5nIG9yZGVyc1xuICovXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciBhbnkgZW52aXJvbm1lbnQuXG5cbiAqL1xuY2xhc3MgTWV0aXNhIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYE1ldGlzYWAgd2l0aCBgb3B0c2AuXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0cyBPcHRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2EgY29udHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hc2ttZXRpc2EuY29tLycsXG4gICAgICAgIHByb2R1Y3RFbmRwb2ludDogXCIvYXBpL3YxL3Byb2R1Y3QtY29sbGVjdGlvblwiLFxuICAgICAgICBvcmRlckVuZHBvaW50OiBcIi9hcGkvdjEvb3JkZXItdHJhbnNhY3Rpb25cIixcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICB0aGlzLmRlYnVnID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhgaW5pdGlhbGlzZWQgTWV0aXNhIHdpdGggJHtKU09OLnN0cmluZ2lmeSh0aGlzLm9wdHMpfSFgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBpdCBpcyByZWFkeSB0byBzdGFydCBjYWxsaW5nIEFQSS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgaXNSZWFkeVRvU3RhcnQoKSB7XG4gICAgdmFyIGlzUmVhZHkgPSBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgb3B0aW9ucyBmcm9tIGBtdCgne3sgb3B0aW9uIH19Jywge3sgdmFsdWUgfX0pYC5cbiAgICovXG4gIHJlZ2lzdGVyT3B0aW9ucygpIHtcbiAgICBpZiAoYXJndW1lbnRzWzBdID09PSAnYmFzZVVybCcpIHtcbiAgICAgIC8vIEluaXQgQmFzZSBVUkwgZm9yIHRlc3RpbmdcbiAgICAgIHRoaXMubG9nKCdCYXNlIFVSTCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLm9wdHMuYmFzZVVybCA9IGFyZ3VtZW50c1sxXTsgLy8gb3ZlcnJpZGVcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Byb2R1Y3QnKSB7XG4gICAgICAvLyBJbml0IFByb2R1Y3Qgb2JqZWN0XG4gICAgICB0aGlzLmxvZygnUHJvZHVjdCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLnByb2R1Y3QgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdvcmRlcicpIHtcbiAgICAgIC8vIEluaXQgT3JkZXIgb2JqZWN0XG4gICAgICB0aGlzLmxvZygnT3JkZXIgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5vcmRlciA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3N0b3JlJykge1xuICAgICAgLy8gSW5pdCBzdG9yZSBzbHVnXG4gICAgICB0aGlzLmxvZygnU3RvcmUgc2x1ZyBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLnNsdWcgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdjdXN0b21lcicpIHtcbiAgICAgIC8vIEluaXQgdXNlciBiYXNlZCByZWNvbW1lbmRhdGlvbnNcbiAgICAgIHRoaXMubG9nKCdDdXN0b21lcl9pZCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmN1c3RvbWVySWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdjYXRlZ29yeScpIHtcbiAgICAgIC8vIEluaXQgY2F0ZWdvcnlcbiAgICAgIHRoaXMubG9nKCdDYXRlZ29yeSBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmNhdGVnb3J5TmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2JyYW5kJykge1xuICAgICAgLy8gSW5pdCBicmFuZFxuICAgICAgdGhpcy5sb2coJ0JyYW5kIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuYnJhbmRuYW1lID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAncHJvZHVjdElkJykge1xuICAgICAgLy8gSW5pdCBwcm9kdWN0IGlkXG4gICAgICB0aGlzLmxvZygnUHJvZHVjdCBJRCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLnByb2R1Y3RJZCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2dlbmRlcicpIHtcbiAgICAgIC8vIEluaXQgZ2VuZGVyXG4gICAgICB0aGlzLmxvZygnR2VuZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuZ2VuZGVyID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnc2Vzc2lvbicpIHtcbiAgICAgIC8vIEluaXQgc2Vzc2lvblxuICAgICAgdGhpcy5sb2coJ1Nlc3Npb24gaXMnLCBhcmd1bWVudHNbMV0pXG4gICAgICB0aGlzLnNlc3Npb25JZCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2xhbmd1YWdlJykge1xuICAgICAgdGhpcy5sb2coJ0xhbmd1YWdlIGlzJywgYXJndW1lbnRzWzFdKVxuICAgICAgdGhpcy5sYW5ndWFnZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYTtcbiIsInZhciBNZXRpc2FDb3JlID0gcmVxdWlyZSgnLi4vY29yZScpO1xudmFyIHdpdGhJRnJhbWUgPSByZXF1aXJlKCcuL3dpdGhJRnJhbWUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xudmFyIGNvbXBvc2UgPSB1dGlsLmNvbXBvc2U7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyB7QGxpbmsgTWV0aXNhfSBjbGFzcyB0aGF0IGNvbXBvc2VzIHdpdGgge0BsaW5rIGNvbXBvc2VDbGFzcy5JRnJhbWV9XG4gKiBAcmVxdWlyZXMgTWV0aXNhXG4gKiBAcmVxdWlyZXMgY29tcG9zZUNsYXNzXG4gKiBAcmVxdWlyZXMgZ2V0VXRpbC5jb21wb3NlXG4gKi9cbnZhciBNZXRpc2F3aXRoSUZyYW1lID0gY29tcG9zZShNZXRpc2FDb3JlKSh3aXRoSUZyYW1lKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEJhc2UgY2xhc3MgZm9yIGJyb3dzZXIgZW52aXJvbm1lbnQuIFRoaXMgaXMgaW5pdGlhbGlzZWQgYW5kIGV4cG9zZWQgdG8gYHdpbmRvdy5NZXRpc2FgIHdoZW4geW91IGltcG9ydCB0aHJvdWdoIG91ciBbZXhhbXBsZV0oLyNpbnN0YWxsYXRpb24pLlxuICogQGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZVxuICovXG5jbGFzcyBNZXRpc2FEb20gZXh0ZW5kcyBNZXRpc2F3aXRoSUZyYW1lIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYE1ldGlzYURvbWAgd2l0aCBgb3B0c2AuXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0cyBPcHRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2FEb20gY29udHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIGlmICgkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ01ldGlzYSBEb20gcmVxdWlyZXMgalF1ZXJ5IHRvIGJlIGF2YWlsYWJsZSEnKVxuICAgIH1cbiAgICBzdXBlcihvcHRzKTtcblxuICAgIGNvbnNvbGUubG9nKGBpbml0aWFsaXNlZCBNZXRpc2EgRG9tIHdpdGggJHtKU09OLnN0cmluZ2lmeSh0aGlzLm9wdHMpfSFgKTtcbiAgICB0aGlzLnJlbmRlcldpZGdldCA9IHRoaXMucmVuZGVyV2lkZ2V0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWdpc3Rlck9wdGlvbnMgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5hdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHJlZ2lzdGVyZWQgb3B0aW9ucyB0byBgd2luZG93Lm10YC5cbiAgICovXG4gIGF0dGFjaFJlZ2lzdGVyT3B0aW9uc1RvV2luZG93KCkge1xuICAgIHdpbmRvdy5tdCA9IHRoaXMucmVnaXN0ZXJPcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBvcHRpb25zIGZyb20gYG10KCd7eyBvcHRpb24gfX0nLCB7eyB2YWx1ZSB9fSlgYW5kIGRldGVybWluZXMgd2hldGhlciBwcm9kdWN0IG9yIG9yZGVyIGRhdGEgc2hvdWxkIGJlIGhhbmRsZWQuXG4gICAqL1xuICByZWdpc3Rlck9wdGlvbnMoKSB7XG4gICAgc3VwZXIucmVnaXN0ZXJPcHRpb25zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICBpZiAodGhpcy5pc1JlYWR5VG9TdGFydCkge1xuICAgICAgdGhpcy5yZW5kZXJXaWRnZXQoKTtcbiAgICAgIGlmICh0aGlzLnByb2R1Y3QpIHtcbiAgICAgICAgdGhpcy50cmFjaygncHJvZHVjdCcsIHRoaXMucHJvZHVjdCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRoaXMub3JkZXIpIHtcbiAgICAgICAgdGhpcy50cmFjaygnb3JkZXInLCB0aGlzLm9yZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyBNZXRpc2Egd2lkZ2V0cyBpbiB0aGUgYnJvd3Nlci5cbiAgICovXG4gIHJlbmRlcldpZGdldCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICB3aWRnZXRzID0gJCgnLm10LXdpZGdldCcpO1xuXG4gICAgLy8gQ29udmVydCB3aWRnZXRzIG5vZGVsaXN0IHRvIHRydWUgYXJyYXlcbiAgICB3aWRnZXRzID0gJC5tYWtlQXJyYXkod2lkZ2V0cyk7XG5cbiAgICB3aWRnZXRzLmZvckVhY2goZnVuY3Rpb24od2lkZ2V0KSB7XG4gICAgICAvLyBSZW5kZXIgd2lkZ2V0IHVzaW5nIEFqYXggc28gd2UgY2FuIGdyYWNlZnVsbHkgZGVncmFkZSBpZiB0aGVyZSBpcyBubyBjb250ZW50IGF2YWlsYWJsZVxuICAgICAgdmFyIHdpZGdldElkID0gd2lkZ2V0LmRhdGFzZXQud2lkZ2V0SWQsXG4gICAgICAgIGN1c3RvbWVySWQgPSB3aWRnZXQuZGF0YXNldC5jdXN0b21lcklkLFxuICAgICAgICBwcm9kdWN0SWQgPSB3aWRnZXQuZGF0YXNldC5wcm9kdWN0SWQsXG4gICAgICAgIGNhdGVnb3J5TmFtZSA9IHdpZGdldC5kYXRhc2V0LmNhdGVnb3J5TmFtZSxcbiAgICAgICAgYnJhbmRuYW1lID0gd2lkZ2V0LmRhdGFzZXQuYnJhbmRuYW1lLFxuICAgICAgICBzZXNzaW9uSWQgPSB3aWRnZXQuZGF0YXNldC5zZXNzaW9uSWQsXG4gICAgICAgIGxhbmd1YWdlID0gd2lkZ2V0LmRhdGFzZXQubGFuZ3VhZ2UsXG4gICAgICAgIHVybCA9IHRoaXMub3B0cy5iYXNlVXJsICsgdGhpcy5zbHVnICsgJy9hcGkvdjEvd2lkZ2V0LWN1c3RvbWVyP3dpZGdldF9pZD0nICsgd2lkZ2V0SWQ7XG5cbiAgICAgIC8vIE92ZXJyaWRlIGN1c3RvbWVyLCBjYXRlZ29yeSBvciBicmFuZFxuICAgICAgaWYgKGN1c3RvbWVySWQpIHRoaXMuY3VzdG9tZXJJZCA9IGN1c3RvbWVySWQ7XG4gICAgICBpZiAocHJvZHVjdElkKSB0aGlzLnByb2R1Y3RJZCA9IHByb2R1Y3RJZDtcbiAgICAgIGlmIChjYXRlZ29yeU5hbWUpIHRoaXMuY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnlOYW1lO1xuICAgICAgaWYgKGJyYW5kbmFtZSkgdGhpcy5icmFuZG5hbWUgPSBicmFuZG5hbWU7XG4gICAgICBpZiAoc2Vzc2lvbklkKSB0aGlzLnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICAgIGlmIChsYW5ndWFnZSkgdGhpcy5sYW5ndWFnZSA9IGxhbmd1YWdlO1xuXG4gICAgICBpZiAodGhpcy5jdXN0b21lcklkKSB7XG4gICAgICAgIHVybCArPSAnJmN1c3RvbWVyX2lkPScgKyBlc2NhcGUodGhpcy5jdXN0b21lcklkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJvZHVjdElkKSB7XG4gICAgICAgIHVybCArPSAnJnByb2R1Y3RfaWQ9JyArIGVzY2FwZSh0aGlzLnByb2R1Y3RJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNhdGVnb3J5TmFtZSkge1xuICAgICAgICB1cmwgKz0gJyZjYXRlZ29yeV9uYW1lPScgKyBlc2NhcGUodGhpcy5jYXRlZ29yeU5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5icmFuZG5hbWUpIHtcbiAgICAgICAgdXJsICs9ICcmYnJhbmRuYW1lPScgKyBlc2NhcGUodGhpcy5icmFuZG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5nZW5kZXIpIHtcbiAgICAgICAgdXJsICs9ICcmZ2VuZGVyPScgKyBlc2NhcGUodGhpcy5nZW5kZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZXNzaW9uSWQpIHtcbiAgICAgICAgdXJsICs9ICcmc2Vzc2lvbl9pZD0nICsgZXNjYXBlKHRoaXMuc2Vzc2lvbklkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubGFuZ3VhZ2UpIHtcbiAgICAgICAgdXJsICs9ICcmbGFuZ3VhZ2U9JyArIGVzY2FwZSh0aGlzLmxhbmd1YWdlKTtcbiAgICAgIH1cblxuICAgICAgdXJsICs9ICcmZm9ybWF0PWh0bWwnO1xuICAgICAgLy8gUHJlcGFyZSBpZnJhbWVcbiAgICAgIHZhciBpZnJhbWUgPSBzZWxmLmNyZWF0ZUlGcmFtZVdpdGhJZCh3aWRnZXRJZCk7XG5cbiAgICAgIHdpZGdldC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgICAvLyBSZW5kZXIgbG9hZGVyXG4gICAgICB2YXIgaHRtbCA9IHNlbGYuZ2V0TG9hZGVySFRNTCgpO1xuXG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShodG1sKTtcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmNsb3NlKCk7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSlcbiAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAvLyBEZWxldGUgbG9hZGVyIGlmcmFtZVxuICAgICAgICB2YXIgb2xkSUZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpZGdldC0nICtcbiAgICAgICAgd2lkZ2V0SWQpO1xuXG4gICAgICAgIHZhciBpZnJhbWVQYXJlbnQgPSBvbGRJRnJhbWUucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAoaWZyYW1lUGFyZW50KSB7XG4gICAgICAgICAgd2hpbGUgKGlmcmFtZVBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBpZnJhbWVQYXJlbnQucmVtb3ZlQ2hpbGQoaWZyYW1lUGFyZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpZnJhbWUgZm9yIHdpZGdldFxuICAgICAgICB2YXIgaWZyYW1lID0gc2VsZi5jcmVhdGVJRnJhbWVXaXRoSWQod2lkZ2V0SWQpO1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgICAgICB2YXIgaHRtbCA9IHNlbGYuZGVjb2RlSHRtbEVudGl0aWVzKGRhdGEpO1xuXG4gICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICczMHB4JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSHRtbCB3aWxsIGJlIGVtcHR5IGlmIHN0b3JlIGhhcyBydW4gb3V0IG9mIGZyZWUgc2FsZXMgY3JlZGl0cy5cbiAgICAgICAgICAgIC8vIEdyYWNlZnVsbHkgZmFpbCB0byBsb2FkIHdpZGdldCBieSByZW1vdmluZyB0aGUgaWZyYW1lIGZyb20gRE9NLlxuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgc3RhdHVzVGV4dCk7XG4gICAgICAgICAgLy8gUmVtb3ZlIGlmcmFtZSBmcm9tIERPTVxuICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0cyB0cmFja2luZyBieSBzdWJtaXR0aW5nIHByb2R1Y3Qgb3Igb3JkZXIgZGF0YSB0byB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2F0IENhdGVnb3J5IG5hbWUgb2YgZGF0YSAoYWxsb3dlZCB2YWx1ZXM6IGBcInByb2R1Y3RcImAsYFwib3JkZXJcImApXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIE9iamVjdCBvZiBwcm9kdWN0IG9yIG9yZGVyIGRhdGFcbiAgICovXG5cbiAgdHJhY2soY2F0LCBkYXRhKSB7XG4gICAgaWYgKHRoaXMuc2x1Zykge1xuICAgICAgaWYgKGNhdCA9PT0gJ3Byb2R1Y3QnKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlT3JVcGRhdGVQcm9kdWN0KGRhdGEpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY2F0ID09PSAnb3JkZXInKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlT3JVcGRhdGVPcmRlcihkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByb2R1Y3QgaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIHByb2R1Y3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9kdWN0RGF0YSBbcHJvZHVjdERhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjcHJvZHVjdC1kYXRhfSBvYmplY3QgdG8gYmUgc3VibWl0dGVkIHRvIHRoZSBwcm9kdWN0IEFQSSBlbmRwb2ludFxuICAgKi9cbiAgY3JlYXRlT3JVcGRhdGVQcm9kdWN0KGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMucHJvZHVjdEVuZHBvaW50O1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyLCBzZXR0aW5ncykge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgfSxcbiAgICAgIHN0YXR1c0NvZGU6IHtcbiAgICAgICAgICA1MDA6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW50ZXJuYWwgc2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyt4aHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3JkZXIgaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIG9yZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JkZXJEYXRhIFtvcmRlckRhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjb3JkZXItZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgb3JkZXIgQVBJIGVuZHBvaW50XG4gICAqL1xuICBjcmVhdGVPclVwZGF0ZU9yZGVyKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMub3JkZXJFbmRwb2ludDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIH0sXG4gICAgICBzdGF0dXNDb2RlOiB7XG4gICAgICAgICAgNTAwOiBmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ludGVybmFsIHNlcnZlciBlcnJvcicpO1xuICAgICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzJyk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcreGhyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgbG9ncyB0byBicm93c2VyIGNvbnNvbGUgd2hlbiBgZGVidWdgIHByb3BlcnR5IG9mIGBNZXRpc2FEb21gIG9iamVjdCBpcyBgdHJ1ZWBcbiAgICovXG4gIGxvZygpIHtcbiAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2cuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYURvbTtcbiIsIi8qKlxuICogUmV0dXJucyB7QGxpbmsgY29tcG9zZUNsYXNzLklGcmFtZX0gY29tcG9zZWQgd2l0aCBgY29tcG9zZWRDbGFzc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSAge2NsYXNzfSBjb21wb3NlZENsYXNzIGBjb21wb3NlZENsYXNzYCB0byBiZSBjb21wb3NlZC5cbiAqIEByZXR1cm5zIHtjb21wb3NlZENsYXNzLklGcmFtZX1cbiAqL1xuXG52YXIgY29tcG9zZUNsYXNzID0gZnVuY3Rpb24oY29tcG9zZWRDbGFzcykge1xuICAvKipcbiAgICogYDxpZnJhbWU+YCBlbGVtZW50IGluIHRoZSByZWNvbW1lbmRhdGlvbiB3aWRnZXQuXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IElGcmFtZVxuICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzXG4gICAqL1xuICByZXR1cm4gY2xhc3MgSUZyYW1lIGV4dGVuZHMgY29tcG9zZWRDbGFzcyB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgaWZyYW1lYCBlbGVtZW50XG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgUmVjb21tZW5kYXRpb24gd2lkZ2V0IElEXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIGNyZWF0ZUlGcmFtZVdpdGhJZChpZCkge1xuICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsICdib3JkZXI6IDBweDsgd2lkdGg6IDEwMCU7Jyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdmcmFtZWJvcmRlcicsICcwJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzY3JvbGxpbmcnLCAnbm8nKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ29ubG9hZCcsICd3aW5kb3cuTWV0aXNhLnJlc2l6ZUlmcmFtZSh0aGlzKScpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2lkZ2V0LScgKyBpZCk7XG5cbiAgICAgIHJldHVybiBpZnJhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyBgaWZyYW1lYCBlbGVtZW50XG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogYGlmcmFtZWAgZWxlbWVudCB0byBiZSByZXNpemVkLlxuICAgICAqL1xuICAgIHJlc2l6ZUlmcmFtZShvYmopIHtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgb2JqLnN0eWxlLmhlaWdodCA9IG9iai5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGxvYWRlciBIVE1MXG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExvYWRlckhUTUwoKSB7XG4gICAgICByZXR1cm4gJzwhZG9jdHlwZSBodG1sPjxodG1sPjxzdHlsZT5ib2R5e2hlaWdodDogMTAwcHg7fS5jcy1sb2FkZXJ7aGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTt9LmNzLWxvYWRlci1pbm5lcnt0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7IHRvcDogNTAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiBjYWxjKDEwMCUgLSAyMDBweCk7IGNvbG9yOiAjQTJBM0EzOyBwYWRkaW5nOiAwIDEwMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWx7Zm9udC1zaXplOiAyMHB4OyBvcGFjaXR5OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fUBrZXlmcmFtZXMgbG9sezAle29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9MTAwJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319QC13ZWJraXQta2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9NjYle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNil7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDUpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg0KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMyl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDIpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgNDAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgxKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9PC9zdHlsZT48Ym9keT4gPGRpdiBjbGFzcz1cImNzLWxvYWRlclwiPiA8ZGl2IGNsYXNzPVwiY3MtbG9hZGVyLWlubmVyXCI+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRlY29kZWQgSFRNTCBlbnRpdGllc1xuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBIVE1MIGVudGl0aWVzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBkZWNvZGVIdG1sRW50aXRpZXMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyYjPyhcXHcrKTsvZywgZnVuY3Rpb24obWF0Y2gsIGRlYykge1xuICAgICAgICBpZiAoaXNOYU4oZGVjKSkge1xuICAgICAgICAgIHZhciBjaGFycyA9IHtcbiAgICAgICAgICAgIHF1b3Q6IDM0LFxuICAgICAgICAgICAgYW1wOiAzOCxcbiAgICAgICAgICAgIGx0OiA2MCxcbiAgICAgICAgICAgIGd0OiA2MixcbiAgICAgICAgICAgIG5ic3A6IDE2MCxcbiAgICAgICAgICAgIGNvcHk6IDE2OSxcbiAgICAgICAgICAgIHJlZzogMTc0LFxuICAgICAgICAgICAgZGVnOiAxNzYsXG4gICAgICAgICAgICBmcmFzbDogNDcsXG4gICAgICAgICAgICB0cmFkZTogODQ4MixcbiAgICAgICAgICAgIGV1cm86IDgzNjQsXG4gICAgICAgICAgICBBZ3JhdmU6IDE5MixcbiAgICAgICAgICAgIEFhY3V0ZTogMTkzLFxuICAgICAgICAgICAgQWNpcmM6IDE5NCxcbiAgICAgICAgICAgIEF0aWxkZTogMTk1LFxuICAgICAgICAgICAgQXVtbDogMTk2LFxuICAgICAgICAgICAgQXJpbmc6IDE5NyxcbiAgICAgICAgICAgIEFFbGlnOiAxOTgsXG4gICAgICAgICAgICBDY2VkaWw6IDE5OSxcbiAgICAgICAgICAgIEVncmF2ZTogMjAwLFxuICAgICAgICAgICAgRWFjdXRlOiAyMDEsXG4gICAgICAgICAgICBFY2lyYzogMjAyLFxuICAgICAgICAgICAgRXVtbDogMjAzLFxuICAgICAgICAgICAgSWdyYXZlOiAyMDQsXG4gICAgICAgICAgICBJYWN1dGU6IDIwNSxcbiAgICAgICAgICAgIEljaXJjOiAyMDYsXG4gICAgICAgICAgICBJdW1sOiAyMDcsXG4gICAgICAgICAgICBFVEg6IDIwOCxcbiAgICAgICAgICAgIE50aWxkZTogMjA5LFxuICAgICAgICAgICAgT2dyYXZlOiAyMTAsXG4gICAgICAgICAgICBPYWN1dGU6IDIxMSxcbiAgICAgICAgICAgIE9jaXJjOiAyMTIsXG4gICAgICAgICAgICBPdGlsZGU6IDIxMyxcbiAgICAgICAgICAgIE91bWw6IDIxNCxcbiAgICAgICAgICAgIHRpbWVzOiAyMTUsXG4gICAgICAgICAgICBPc2xhc2g6IDIxNixcbiAgICAgICAgICAgIFVncmF2ZTogMjE3LFxuICAgICAgICAgICAgVWFjdXRlOiAyMTgsXG4gICAgICAgICAgICBVY2lyYzogMjE5LFxuICAgICAgICAgICAgVXVtbDogMjIwLFxuICAgICAgICAgICAgWWFjdXRlOiAyMjEsXG4gICAgICAgICAgICBUSE9STjogMjIyLFxuICAgICAgICAgICAgc3psaWc6IDIyMyxcbiAgICAgICAgICAgIGFncmF2ZTogMjI0LFxuICAgICAgICAgICAgYWFjdXRlOiAyMjUsXG4gICAgICAgICAgICBhY2lyYzogMjI2LFxuICAgICAgICAgICAgYXRpbGRlOiAyMjcsXG4gICAgICAgICAgICBhdW1sOiAyMjgsXG4gICAgICAgICAgICBhcmluZzogMjI5LFxuICAgICAgICAgICAgYWVsaWc6IDIzMCxcbiAgICAgICAgICAgIGNjZWRpbDogMjMxLFxuICAgICAgICAgICAgZWdyYXZlOiAyMzIsXG4gICAgICAgICAgICBlYWN1dGU6IDIzMyxcbiAgICAgICAgICAgIGVjaXJjOiAyMzQsXG4gICAgICAgICAgICBldW1sOiAyMzUsXG4gICAgICAgICAgICBpZ3JhdmU6IDIzNixcbiAgICAgICAgICAgIGlhY3V0ZTogMjM3LFxuICAgICAgICAgICAgaWNpcmM6IDIzOCxcbiAgICAgICAgICAgIGl1bWw6IDIzOSxcbiAgICAgICAgICAgIGV0aDogMjQwLFxuICAgICAgICAgICAgbnRpbGRlOiAyNDEsXG4gICAgICAgICAgICBvZ3JhdmU6IDI0MixcbiAgICAgICAgICAgIG9hY3V0ZTogMjQzLFxuICAgICAgICAgICAgb2NpcmM6IDI0NCxcbiAgICAgICAgICAgIG90aWxkZTogMjQ1LFxuICAgICAgICAgICAgb3VtbDogMjQ2LFxuICAgICAgICAgICAgZGl2aWRlOiAyNDcsXG4gICAgICAgICAgICBvc2xhc2g6IDI0OCxcbiAgICAgICAgICAgIHVncmF2ZTogMjQ5LFxuICAgICAgICAgICAgdWFjdXRlOiAyNTAsXG4gICAgICAgICAgICB1Y2lyYzogMjUxLFxuICAgICAgICAgICAgdXVtbDogMjUyLFxuICAgICAgICAgICAgeWFjdXRlOiAyNTMsXG4gICAgICAgICAgICB0aG9ybjogMjU0LFxuICAgICAgICAgICAgeXVtbDogMjU1LFxuICAgICAgICAgICAgbHNxdW86IDgyMTYsXG4gICAgICAgICAgICByc3F1bzogODIxNyxcbiAgICAgICAgICAgIHNicXVvOiA4MjE4LFxuICAgICAgICAgICAgbGRxdW86IDgyMjAsXG4gICAgICAgICAgICByZHF1bzogODIyMSxcbiAgICAgICAgICAgIGJkcXVvOiA4MjIyLFxuICAgICAgICAgICAgZGFnZ2VyOiA4MjI0LFxuICAgICAgICAgICAgRGFnZ2VyOiA4MjI1LFxuICAgICAgICAgICAgcGVybWlsOiA4MjQwLFxuICAgICAgICAgICAgbHNhcXVvOiA4MjQ5LFxuICAgICAgICAgICAgcnNhcXVvOiA4MjUwLFxuICAgICAgICAgICAgc3BhZGVzOiA5ODI0LFxuICAgICAgICAgICAgY2x1YnM6IDk4MjcsXG4gICAgICAgICAgICBoZWFydHM6IDk4MjksXG4gICAgICAgICAgICBkaWFtczogOTgzMCxcbiAgICAgICAgICAgIG9saW5lOiA4MjU0LFxuICAgICAgICAgICAgbGFycjogODU5MixcbiAgICAgICAgICAgIHVhcnI6IDg1OTMsXG4gICAgICAgICAgICByYXJyOiA4NTk0LFxuICAgICAgICAgICAgZGFycjogODU5NSxcbiAgICAgICAgICAgIGhlbGxpcDogMTMzLFxuICAgICAgICAgICAgbmRhc2g6IDE1MCxcbiAgICAgICAgICAgIG1kYXNoOiAxNTEsXG4gICAgICAgICAgICBpZXhjbDogMTYxLFxuICAgICAgICAgICAgY2VudDogMTYyLFxuICAgICAgICAgICAgcG91bmQ6IDE2MyxcbiAgICAgICAgICAgIGN1cnJlbjogMTY0LFxuICAgICAgICAgICAgeWVuOiAxNjUsXG4gICAgICAgICAgICBicnZiYXI6IDE2NixcbiAgICAgICAgICAgIGJya2JhcjogMTY2LFxuICAgICAgICAgICAgc2VjdDogMTY3LFxuICAgICAgICAgICAgdW1sOiAxNjgsXG4gICAgICAgICAgICBkaWU6IDE2OCxcbiAgICAgICAgICAgIG9yZGY6IDE3MCxcbiAgICAgICAgICAgIGxhcXVvOiAxNzEsXG4gICAgICAgICAgICBub3Q6IDE3MixcbiAgICAgICAgICAgIHNoeTogMTczLFxuICAgICAgICAgICAgbWFjcjogMTc1LFxuICAgICAgICAgICAgaGliYXI6IDE3NSxcbiAgICAgICAgICAgIHBsdXNtbjogMTc3LFxuICAgICAgICAgICAgc3VwMjogMTc4LFxuICAgICAgICAgICAgc3VwMzogMTc5LFxuICAgICAgICAgICAgYWN1dGU6IDE4MCxcbiAgICAgICAgICAgIG1pY3JvOiAxODEsXG4gICAgICAgICAgICBwYXJhOiAxODIsXG4gICAgICAgICAgICBtaWRkb3Q6IDE4MyxcbiAgICAgICAgICAgIGNlZGlsOiAxODQsXG4gICAgICAgICAgICBzdXAxOiAxODUsXG4gICAgICAgICAgICBvcmRtOiAxODYsXG4gICAgICAgICAgICByYXF1bzogMTg3LFxuICAgICAgICAgICAgZnJhYzE0OiAxODgsXG4gICAgICAgICAgICBmcmFjMTI6IDE4OSxcbiAgICAgICAgICAgIGZyYWMzNDogMTkwLFxuICAgICAgICAgICAgaXF1ZXN0OiAxOTEsXG4gICAgICAgICAgICBBbHBoYTogOTEzLFxuICAgICAgICAgICAgYWxwaGE6IDk0NSxcbiAgICAgICAgICAgIEJldGE6IDkxNCxcbiAgICAgICAgICAgIGJldGE6IDk0NixcbiAgICAgICAgICAgIEdhbW1hOiA5MTUsXG4gICAgICAgICAgICBnYW1tYTogOTQ3LFxuICAgICAgICAgICAgRGVsdGE6IDkxNixcbiAgICAgICAgICAgIGRlbHRhOiA5NDgsXG4gICAgICAgICAgICBFcHNpbG9uOiA5MTcsXG4gICAgICAgICAgICBlcHNpbG9uOiA5NDksXG4gICAgICAgICAgICBaZXRhOiA5MTgsXG4gICAgICAgICAgICB6ZXRhOiA5NTAsXG4gICAgICAgICAgICBFdGE6IDkxOSxcbiAgICAgICAgICAgIGV0YTogOTUxLFxuICAgICAgICAgICAgVGhldGE6IDkyMCxcbiAgICAgICAgICAgIHRoZXRhOiA5NTIsXG4gICAgICAgICAgICBJb3RhOiA5MjEsXG4gICAgICAgICAgICBpb3RhOiA5NTMsXG4gICAgICAgICAgICBLYXBwYTogOTIyLFxuICAgICAgICAgICAga2FwcGE6IDk1NCxcbiAgICAgICAgICAgIExhbWJkYTogOTIzLFxuICAgICAgICAgICAgbGFtYmRhOiA5NTUsXG4gICAgICAgICAgICBNdTogOTI0LFxuICAgICAgICAgICAgbXU6IDk1NixcbiAgICAgICAgICAgIE51OiA5MjUsXG4gICAgICAgICAgICBudTogOTU3LFxuICAgICAgICAgICAgWGk6IDkyNixcbiAgICAgICAgICAgIHhpOiA5NTgsXG4gICAgICAgICAgICBPbWljcm9uOiA5MjcsXG4gICAgICAgICAgICBvbWljcm9uOiA5NTksXG4gICAgICAgICAgICBQaTogOTI4LFxuICAgICAgICAgICAgcGk6IDk2MCxcbiAgICAgICAgICAgIFJobzogOTI5LFxuICAgICAgICAgICAgcmhvOiA5NjEsXG4gICAgICAgICAgICBTaWdtYTogOTMxLFxuICAgICAgICAgICAgc2lnbWE6IDk2MyxcbiAgICAgICAgICAgIFRhdTogOTMyLFxuICAgICAgICAgICAgdGF1OiA5NjQsXG4gICAgICAgICAgICBVcHNpbG9uOiA5MzMsXG4gICAgICAgICAgICB1cHNpbG9uOiA5NjUsXG4gICAgICAgICAgICBQaGk6IDkzNCxcbiAgICAgICAgICAgIHBoaTogOTY2LFxuICAgICAgICAgICAgQ2hpOiA5MzUsXG4gICAgICAgICAgICBjaGk6IDk2NyxcbiAgICAgICAgICAgIFBzaTogOTM2LFxuICAgICAgICAgICAgcHNpOiA5NjgsXG4gICAgICAgICAgICBPbWVnYTogOTM3LFxuICAgICAgICAgICAgb21lZ2E6IDk2OVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoY2hhcnNbZGVjXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkZWMgPSBjaGFyc1tkZWNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShkZWMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlQ2xhc3M7XG4iLCJjb25zdCBNZXRpc2FEb20gPSByZXF1aXJlKCcuL01ldGlzYS9kb20nKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuXG4vKipcbiAqIExvYWRzIGpRdWVyeSBhbmQge0BsaW5rIE1ldGlzYURvbX0gb2JqZWN0IGludG8gd2luZG93IG9iamVjdCBpbiBicm93c2VyXG4gKiBAcHJpdmF0ZVxuICogQHJlcXVpcmVzIE1ldGlzYURvbVxuICogQHJlcXVpcmVzIGdldFV0aWxcbiAqL1xuZnVuY3Rpb24gYnJvd3NlcigpIHtcbiAgaWYgKHV0aWwuZW52aXJvbm1lbnQgIT09ICdicm93c2VyJyApIHtcbiAgICByZXR1cm4gY29uc29sZS53YXJuKCdNZXRpc2EgYnJvd3NlciBjYW4gb25seSBydW4gaW5zaWRlIGEgYnJvd3NlcicpO1xuICB9XG4gIHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9ICQgfHwgalF1ZXJ5IHx8IHt9O1xuXG4gIHdpbmRvdy5NZXRpc2EgPSBuZXcgTWV0aXNhRG9tKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKGJyb3dzZXIpKCk7XG4iLCIvKipcbiAqIEdldHMgU0RLIHV0aWxpdGllc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7VXRpbE9ian1cbiAqL1xuZnVuY3Rpb24gZ2V0VXRpbCgpIHtcbiAgLyoqXG4gICAqIE9iamVjdCBjb250YWluaW5nIHV0aWxpbGl0aWVzXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IFV0aWxPYmpcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVudmlyb25tZW50IEVudmlyb25tZW50IHRoYXQgTWV0aXNhIG9iamVjdCBpcyBleHBvc2VkIHRvLiBSZXR1cm5zIGAnYnJvd3NlcidgIG9yIGBub2RlYC5cbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gY29tcG9zZSBbRnVuY3Rpb25dKCNnZXR1dGlsY29tcG9zZWZ1bmNvcmlnaW5hbC3ih5ItY2xhc3MpIGZvciBjb21wb3NpbmcgY2xhc3Nlc1xuICAgKiBAbWVtYmVyb2YgZ2V0VXRpbFxuICAgKi9cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wb3NlZCBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtICB7Y2xhc3N9IG9yaWdpbmFsIENsYXNzIHRvIGJlIGNvbXBvc2VkIHRvLlxuICAgKiBAcmV0dXJuIHtjbGFzc31cbiAgICovXG4gIHZhciBjb21wb3NlRnVuYyA9IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY29tcG9zaXRpb25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBjb21wb3NlZCA9IG9yaWdpbmFsO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29tcG9zZWQgPSBjb21wb3NpdGlvbnNbaV0oY29tcG9zZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbXBvc2VkO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBlbnZpcm9ubWVudDogdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyAnYnJvd3NlcicgOiAnbm9kZScsXG4gICAgY29tcG9zZTogY29tcG9zZUZ1bmMsXG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IChnZXRVdGlsKSgpO1xuIl19
