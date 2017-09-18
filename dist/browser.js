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
 *
 * @class
 * @classdesc Base class for any environment.

 */
class Metisa {
  /**
   * Constructs a new {@link Metisa} with `opts`.
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
 * @class
 * @classdesc {@link Metisa} class that composes with {@link IFrame}
 * @requires Metisa
 * @requires composeClass
 * @requires getUtil.compose
 */
var MetisawithIFrame = compose(MetisaCore)(withIFrame);

/**
 *
 * @class
 * @classdesc Base class for browser environment. This is initialised and exposed to `window.Metisa` when you import through our [example](/#installation).
 * @extends MetisawithIFrame
 */
class MetisaDom extends MetisawithIFrame {
  /**
   * Constructs a new {@link MetisaDom} with `opts`.
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
 * Returns {@link IFrame} composed with `composedClass`.
 *
 *
 * @param  {class} composedClass Class to be composed.
 * @returns {IFrame}
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
     * @memberof IFrame
     * @returns {string}
     */
    getLoaderHTML() {
      return '<!doctype html><html><style>body{height: 100px;}.cs-loader{height: 100%; width: 100%;}.cs-loader-inner{transform: translateY(-50%); top: 50%; position: absolute; width: calc(100% - 200px); color: #A2A3A3; padding: 0 100px; text-align: center;}.cs-loader-inner label{font-size: 20px; opacity: 0; display: inline-block;}@keyframes lol{0%{opacity: 0; transform: translateX(-300px);}33%{opacity: 1; transform: translateX(0px);}66%{opacity: 1; transform: translateX(0px);}100%{opacity: 0; transform: translateX(300px);}}@-webkit-keyframes lol{0%{opacity: 0; -webkit-transform: translateX(-300px);}33%{opacity: 1; -webkit-transform: translateX(0px);}66%{opacity: 1; -webkit-transform: translateX(0px);}100%{opacity: 0; -webkit-transform: translateX(300px);}}.cs-loader-inner label:nth-child(6){-webkit-animation: lol 3s infinite ease-in-out; animation: lol 3s infinite ease-in-out;}.cs-loader-inner label:nth-child(5){-webkit-animation: lol 3s 100ms infinite ease-in-out; animation: lol 3s 100ms infinite ease-in-out;}.cs-loader-inner label:nth-child(4){-webkit-animation: lol 3s 200ms infinite ease-in-out; animation: lol 3s 200ms infinite ease-in-out;}.cs-loader-inner label:nth-child(3){-webkit-animation: lol 3s 300ms infinite ease-in-out; animation: lol 3s 300ms infinite ease-in-out;}.cs-loader-inner label:nth-child(2){-webkit-animation: lol 3s 400ms infinite ease-in-out; animation: lol 3s 400ms infinite ease-in-out;}.cs-loader-inner label:nth-child(1){-webkit-animation: lol 3s 500ms infinite ease-in-out; animation: lol 3s 500ms infinite ease-in-out;}</style><body> <div class="cs-loader"> <div class="cs-loader-inner"> <label>●</label> <label>●</label> <label>●</label> <label>●</label> <label>●</label> <label>●</label> </div></div></body></html>';
    }

    /**
     * Returns decoded HTML entities
     * @memberof IFrame
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
 * 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBPcHRpb25zIG9iamVjdCBkZWZpbml0aW9uXG4gKiBAcHJpdmF0ZVxuICogQHR5cGVkZWYge09iamVjdH0gT3B0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGJhc2VVcmw9aHR0cHM6Ly9hc2ttZXRpc2EuY29tLyBCYXNlIFVSTCBvZiBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcm9kdWN0RW5kcG9pbnQ9L2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb24gUGF0aCBvZiBBUEkgZW5kcG9pbnQgZm9yIGNyZWF0aW5nIG9yIHVwZGF0aW5nIHByb2R1Y3RzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3JkZXJFbmRwb2ludD0vYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uIFBhdGggb2YgQVBJIGVuZHBvaW50IGZvciBjcmVhdGluZyBvciB1cGRhdGluZyBvcmRlcnNcbiAqL1xuXG4vKipcbiAqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgYW55IGVudmlyb25tZW50LlxuXG4gKi9cbmNsYXNzIE1ldGlzYSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IHtAbGluayBNZXRpc2F9IHdpdGggYG9wdHNgLlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhIGNvbnRydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKFxuICAgIHtcbiAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXNrbWV0aXNhLmNvbS8nLFxuICAgICAgICBwcm9kdWN0RW5kcG9pbnQ6IFwiL2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb25cIixcbiAgICAgICAgb3JkZXJFbmRwb2ludDogXCIvYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uXCIsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5vcHRzKX0hYCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgcmVhZHkgdG8gc3RhcnQgY2FsbGluZyBBUEkuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGlzUmVhZHlUb1N0YXJ0KCkge1xuICAgIHZhciBpc1JlYWR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWAuXG4gICAqL1xuICByZWdpc3Rlck9wdGlvbnMoKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2Jhc2VVcmwnKSB7XG4gICAgICAvLyBJbml0IEJhc2UgVVJMIGZvciB0ZXN0aW5nXG4gICAgICB0aGlzLmxvZygnQmFzZSBVUkwgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5vcHRzLmJhc2VVcmwgPSBhcmd1bWVudHNbMV07IC8vIG92ZXJyaWRlXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdwcm9kdWN0Jykge1xuICAgICAgLy8gSW5pdCBQcm9kdWN0IG9iamVjdFxuICAgICAgdGhpcy5sb2coJ1Byb2R1Y3QgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5wcm9kdWN0ID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnb3JkZXInKSB7XG4gICAgICAvLyBJbml0IE9yZGVyIG9iamVjdFxuICAgICAgdGhpcy5sb2coJ09yZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMub3JkZXIgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdzdG9yZScpIHtcbiAgICAgIC8vIEluaXQgc3RvcmUgc2x1Z1xuICAgICAgdGhpcy5sb2coJ1N0b3JlIHNsdWcgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5zbHVnID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAvLyBJbml0IHVzZXIgYmFzZWQgcmVjb21tZW5kYXRpb25zXG4gICAgICB0aGlzLmxvZygnQ3VzdG9tZXJfaWQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jdXN0b21lcklkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY2F0ZWdvcnknKSB7XG4gICAgICAvLyBJbml0IGNhdGVnb3J5XG4gICAgICB0aGlzLmxvZygnQ2F0ZWdvcnkgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jYXRlZ29yeU5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdicmFuZCcpIHtcbiAgICAgIC8vIEluaXQgYnJhbmRcbiAgICAgIHRoaXMubG9nKCdCcmFuZCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmJyYW5kbmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Byb2R1Y3RJZCcpIHtcbiAgICAgIC8vIEluaXQgcHJvZHVjdCBpZFxuICAgICAgdGhpcy5sb2coJ1Byb2R1Y3QgSUQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5wcm9kdWN0SWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdnZW5kZXInKSB7XG4gICAgICAvLyBJbml0IGdlbmRlclxuICAgICAgdGhpcy5sb2coJ0dlbmRlciBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmdlbmRlciA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Nlc3Npb24nKSB7XG4gICAgICAvLyBJbml0IHNlc3Npb25cbiAgICAgIHRoaXMubG9nKCdTZXNzaW9uIGlzJywgYXJndW1lbnRzWzFdKVxuICAgICAgdGhpcy5zZXNzaW9uSWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMubG9nKCdMYW5ndWFnZSBpcycsIGFyZ3VtZW50c1sxXSlcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNZXRpc2E7XG4iLCJ2YXIgTWV0aXNhQ29yZSA9IHJlcXVpcmUoJy4uL2NvcmUnKTtcbnZhciB3aXRoSUZyYW1lID0gcmVxdWlyZSgnLi93aXRoSUZyYW1lJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcbnZhciBjb21wb3NlID0gdXRpbC5jb21wb3NlO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyB7QGxpbmsgTWV0aXNhfSBjbGFzcyB0aGF0IGNvbXBvc2VzIHdpdGgge0BsaW5rIElGcmFtZX1cbiAqIEByZXF1aXJlcyBNZXRpc2FcbiAqIEByZXF1aXJlcyBjb21wb3NlQ2xhc3NcbiAqIEByZXF1aXJlcyBnZXRVdGlsLmNvbXBvc2VcbiAqL1xudmFyIE1ldGlzYXdpdGhJRnJhbWUgPSBjb21wb3NlKE1ldGlzYUNvcmUpKHdpdGhJRnJhbWUpO1xuXG4vKipcbiAqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgYnJvd3NlciBlbnZpcm9ubWVudC4gVGhpcyBpcyBpbml0aWFsaXNlZCBhbmQgZXhwb3NlZCB0byBgd2luZG93Lk1ldGlzYWAgd2hlbiB5b3UgaW1wb3J0IHRocm91Z2ggb3VyIFtleGFtcGxlXSgvI2luc3RhbGxhdGlvbikuXG4gKiBAZXh0ZW5kcyBNZXRpc2F3aXRoSUZyYW1lXG4gKi9cbmNsYXNzIE1ldGlzYURvbSBleHRlbmRzIE1ldGlzYXdpdGhJRnJhbWUge1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyB7QGxpbmsgTWV0aXNhRG9tfSB3aXRoIGBvcHRzYC5cbiAgICogQHBhcmFtIHtPcHRzfSBvcHRzIE9wdGlvbiBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIE1ldGlzYURvbSBjb250cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgaWYgKCQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIERvbSByZXF1aXJlcyBqUXVlcnkgdG8gYmUgYXZhaWxhYmxlIScpXG4gICAgfVxuICAgIHN1cGVyKG9wdHMpO1xuXG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSBEb20gd2l0aCAke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9IWApO1xuICAgIHRoaXMucmVuZGVyV2lkZ2V0ID0gdGhpcy5yZW5kZXJXaWRnZXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyT3B0aW9ucyA9IHRoaXMucmVnaXN0ZXJPcHRpb25zLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmF0dGFjaFJlZ2lzdGVyT3B0aW9uc1RvV2luZG93KCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgcmVnaXN0ZXJlZCBvcHRpb25zIHRvIGB3aW5kb3cubXRgLlxuICAgKi9cbiAgYXR0YWNoUmVnaXN0ZXJPcHRpb25zVG9XaW5kb3coKSB7XG4gICAgd2luZG93Lm10ID0gdGhpcy5yZWdpc3Rlck9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWBhbmQgZGV0ZXJtaW5lcyB3aGV0aGVyIHByb2R1Y3Qgb3Igb3JkZXIgZGF0YSBzaG91bGQgYmUgaGFuZGxlZC5cbiAgICovXG4gIHJlZ2lzdGVyT3B0aW9ucygpIHtcbiAgICBzdXBlci5yZWdpc3Rlck9wdGlvbnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGlmICh0aGlzLmlzUmVhZHlUb1N0YXJ0KSB7XG4gICAgICB0aGlzLnJlbmRlcldpZGdldCgpO1xuICAgICAgaWYgKHRoaXMucHJvZHVjdCkge1xuICAgICAgICB0aGlzLnRyYWNrKCdwcm9kdWN0JywgdGhpcy5wcm9kdWN0KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5vcmRlcikge1xuICAgICAgICB0aGlzLnRyYWNrKCdvcmRlcicsIHRoaXMub3JkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIE1ldGlzYSB3aWRnZXRzIGluIHRoZSBicm93c2VyLlxuICAgKi9cbiAgcmVuZGVyV2lkZ2V0KCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIHdpZGdldHMgPSAkKCcubXQtd2lkZ2V0Jyk7XG5cbiAgICAvLyBDb252ZXJ0IHdpZGdldHMgbm9kZWxpc3QgdG8gdHJ1ZSBhcnJheVxuICAgIHdpZGdldHMgPSAkLm1ha2VBcnJheSh3aWRnZXRzKTtcblxuICAgIHdpZGdldHMuZm9yRWFjaChmdW5jdGlvbih3aWRnZXQpIHtcbiAgICAgIC8vIFJlbmRlciB3aWRnZXQgdXNpbmcgQWpheCBzbyB3ZSBjYW4gZ3JhY2VmdWxseSBkZWdyYWRlIGlmIHRoZXJlIGlzIG5vIGNvbnRlbnQgYXZhaWxhYmxlXG4gICAgICB2YXIgd2lkZ2V0SWQgPSB3aWRnZXQuZGF0YXNldC53aWRnZXRJZCxcbiAgICAgICAgY3VzdG9tZXJJZCA9IHdpZGdldC5kYXRhc2V0LmN1c3RvbWVySWQsXG4gICAgICAgIHByb2R1Y3RJZCA9IHdpZGdldC5kYXRhc2V0LnByb2R1Y3RJZCxcbiAgICAgICAgY2F0ZWdvcnlOYW1lID0gd2lkZ2V0LmRhdGFzZXQuY2F0ZWdvcnlOYW1lLFxuICAgICAgICBicmFuZG5hbWUgPSB3aWRnZXQuZGF0YXNldC5icmFuZG5hbWUsXG4gICAgICAgIHNlc3Npb25JZCA9IHdpZGdldC5kYXRhc2V0LnNlc3Npb25JZCxcbiAgICAgICAgbGFuZ3VhZ2UgPSB3aWRnZXQuZGF0YXNldC5sYW5ndWFnZSxcbiAgICAgICAgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyAnL2FwaS92MS93aWRnZXQtY3VzdG9tZXI/d2lkZ2V0X2lkPScgKyB3aWRnZXRJZDtcblxuICAgICAgLy8gT3ZlcnJpZGUgY3VzdG9tZXIsIGNhdGVnb3J5IG9yIGJyYW5kXG4gICAgICBpZiAoY3VzdG9tZXJJZCkgdGhpcy5jdXN0b21lcklkID0gY3VzdG9tZXJJZDtcbiAgICAgIGlmIChwcm9kdWN0SWQpIHRoaXMucHJvZHVjdElkID0gcHJvZHVjdElkO1xuICAgICAgaWYgKGNhdGVnb3J5TmFtZSkgdGhpcy5jYXRlZ29yeU5hbWUgPSBjYXRlZ29yeU5hbWU7XG4gICAgICBpZiAoYnJhbmRuYW1lKSB0aGlzLmJyYW5kbmFtZSA9IGJyYW5kbmFtZTtcbiAgICAgIGlmIChzZXNzaW9uSWQpIHRoaXMuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgICAgaWYgKGxhbmd1YWdlKSB0aGlzLmxhbmd1YWdlID0gbGFuZ3VhZ2U7XG5cbiAgICAgIGlmICh0aGlzLmN1c3RvbWVySWQpIHtcbiAgICAgICAgdXJsICs9ICcmY3VzdG9tZXJfaWQ9JyArIGVzY2FwZSh0aGlzLmN1c3RvbWVySWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcm9kdWN0SWQpIHtcbiAgICAgICAgdXJsICs9ICcmcHJvZHVjdF9pZD0nICsgZXNjYXBlKHRoaXMucHJvZHVjdElkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2F0ZWdvcnlOYW1lKSB7XG4gICAgICAgIHVybCArPSAnJmNhdGVnb3J5X25hbWU9JyArIGVzY2FwZSh0aGlzLmNhdGVnb3J5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJyYW5kbmFtZSkge1xuICAgICAgICB1cmwgKz0gJyZicmFuZG5hbWU9JyArIGVzY2FwZSh0aGlzLmJyYW5kbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmdlbmRlcikge1xuICAgICAgICB1cmwgKz0gJyZnZW5kZXI9JyArIGVzY2FwZSh0aGlzLmdlbmRlcik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlc3Npb25JZCkge1xuICAgICAgICB1cmwgKz0gJyZzZXNzaW9uX2lkPScgKyBlc2NhcGUodGhpcy5zZXNzaW9uSWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYW5ndWFnZSkge1xuICAgICAgICB1cmwgKz0gJyZsYW5ndWFnZT0nICsgZXNjYXBlKHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgfVxuXG4gICAgICB1cmwgKz0gJyZmb3JtYXQ9aHRtbCc7XG4gICAgICAvLyBQcmVwYXJlIGlmcmFtZVxuICAgICAgdmFyIGlmcmFtZSA9IHNlbGYuY3JlYXRlSUZyYW1lV2l0aElkKHdpZGdldElkKTtcblxuICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgIC8vIFJlbmRlciBsb2FkZXJcbiAgICAgIHZhciBodG1sID0gc2VsZi5nZXRMb2FkZXJIVE1MKCk7XG5cbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgIC8vIERlbGV0ZSBsb2FkZXIgaWZyYW1lXG4gICAgICAgIHZhciBvbGRJRnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lkZ2V0LScgK1xuICAgICAgICB3aWRnZXRJZCk7XG5cbiAgICAgICAgdmFyIGlmcmFtZVBhcmVudCA9IG9sZElGcmFtZS5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChpZnJhbWVQYXJlbnQpIHtcbiAgICAgICAgICB3aGlsZSAoaWZyYW1lUGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGlmcmFtZVBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWVQYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGlmcmFtZSBmb3Igd2lkZ2V0XG4gICAgICAgIHZhciBpZnJhbWUgPSBzZWxmLmNyZWF0ZUlGcmFtZVdpdGhJZCh3aWRnZXRJZCk7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgICAgICAgIHZhciBodG1sID0gc2VsZi5kZWNvZGVIdG1sRW50aXRpZXMoZGF0YSk7XG5cbiAgICAgICAgICBpZiAoaHRtbCkge1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQub3BlbigpO1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoaHRtbCk7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUuc3R5bGUubWFyZ2luQm90dG9tID0gJzMwcHgnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBIdG1sIHdpbGwgYmUgZW1wdHkgaWYgc3RvcmUgaGFzIHJ1biBvdXQgb2YgZnJlZSBzYWxlcyBjcmVkaXRzLlxuICAgICAgICAgICAgLy8gR3JhY2VmdWxseSBmYWlsIHRvIGxvYWQgd2lkZ2V0IGJ5IHJlbW92aW5nIHRoZSBpZnJhbWUgZnJvbSBET00uXG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcgKyBzdGF0dXNUZXh0KTtcbiAgICAgICAgICAvLyBSZW1vdmUgaWZyYW1lIGZyb20gRE9NXG4gICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxuICAvKipcbiAgICogU3RhcnRzIHRyYWNraW5nIGJ5IHN1Ym1pdHRpbmcgcHJvZHVjdCBvciBvcmRlciBkYXRhIHRvIHRoZSBBUEkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXQgQ2F0ZWdvcnkgbmFtZSBvZiBkYXRhIChhbGxvd2VkIHZhbHVlczogYFwicHJvZHVjdFwiYCxgXCJvcmRlclwiYClcbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgT2JqZWN0IG9mIHByb2R1Y3Qgb3Igb3JkZXIgZGF0YVxuICAgKi9cblxuICB0cmFjayhjYXQsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5zbHVnKSB7XG4gICAgICBpZiAoY2F0ID09PSAncHJvZHVjdCcpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVPclVwZGF0ZVByb2R1Y3QoZGF0YSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjYXQgPT09ICdvcmRlcicpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVPclVwZGF0ZU9yZGVyKGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcHJvZHVjdCBpZiBpdCBkb2VzIG5vdCBleGlzdCBpbiBNZXRpc2Egb3IgdXBkYXRlcyB0aGUgcHJvZHVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHByb2R1Y3REYXRhIFtwcm9kdWN0RGF0YV17QGxpbmsgQlJPV1NFUi9TQ0hFTUEuaHRtbCNwcm9kdWN0LWRhdGF9IG9iamVjdCB0byBiZSBzdWJtaXR0ZWQgdG8gdGhlIHByb2R1Y3QgQVBJIGVuZHBvaW50XG4gICAqL1xuICBjcmVhdGVPclVwZGF0ZVByb2R1Y3QoZGF0YSkge1xuICAgIHZhciB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArIHRoaXMub3B0cy5wcm9kdWN0RW5kcG9pbnQ7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICB9LFxuICAgICAgc3RhdHVzQ29kZToge1xuICAgICAgICAgIDUwMDogZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnK3hocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvcmRlciBpZiBpdCBkb2VzIG5vdCBleGlzdCBpbiBNZXRpc2Egb3IgdXBkYXRlcyB0aGUgb3JkZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmRlckRhdGEgW29yZGVyRGF0YV17QGxpbmsgQlJPV1NFUi9TQ0hFTUEuaHRtbCNvcmRlci1kYXRhfSBvYmplY3QgdG8gYmUgc3VibWl0dGVkIHRvIHRoZSBvcmRlciBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlT3JkZXIoZGF0YSkge1xuICAgIHZhciB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArIHRoaXMub3B0cy5vcmRlckVuZHBvaW50O1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyLCBzZXR0aW5ncykge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgfSxcbiAgICAgIHN0YXR1c0NvZGU6IHtcbiAgICAgICAgICA1MDA6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW50ZXJuYWwgc2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyt4aHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlcyBsb2dzIHRvIGJyb3dzZXIgY29uc29sZSB3aGVuIGBkZWJ1Z2AgcHJvcGVydHkgb2YgYE1ldGlzYURvbWAgb2JqZWN0IGlzIGB0cnVlYFxuICAgKi9cbiAgbG9nKCkge1xuICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0aXNhRG9tO1xuIiwiLyoqXG4gKiBSZXR1cm5zIHtAbGluayBJRnJhbWV9IGNvbXBvc2VkIHdpdGggYGNvbXBvc2VkQ2xhc3NgLlxuICpcbiAqXG4gKiBAcGFyYW0gIHtjbGFzc30gY29tcG9zZWRDbGFzcyBDbGFzcyB0byBiZSBjb21wb3NlZC5cbiAqIEByZXR1cm5zIHtJRnJhbWV9XG4gKi9cblxudmFyIGNvbXBvc2VDbGFzcyA9IGZ1bmN0aW9uKGNvbXBvc2VkQ2xhc3MpIHtcbiAgLyoqXG4gICAqIGA8aWZyYW1lPmAgZWxlbWVudCBpbiB0aGUgcmVjb21tZW5kYXRpb24gd2lkZ2V0LlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBJRnJhbWVcbiAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzc1xuICAgKi9cbiAgcmV0dXJuIGNsYXNzIElGcmFtZSBleHRlbmRzIGNvbXBvc2VkQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYGlmcmFtZWAgZWxlbWVudFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFJlY29tbWVuZGF0aW9uIHdpZGdldCBJRFxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjcmVhdGVJRnJhbWVXaXRoSWQoaWQpIHtcbiAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnYm9yZGVyOiAwcHg7IHdpZHRoOiAxMDAlOycpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc2Nyb2xsaW5nJywgJ25vJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdvbmxvYWQnLCAnd2luZG93Lk1ldGlzYS5yZXNpemVJZnJhbWUodGhpcyknKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpZGdldC0nICsgaWQpO1xuXG4gICAgICByZXR1cm4gaWZyYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2l6ZXMgYGlmcmFtZWAgZWxlbWVudFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIGBpZnJhbWVgIGVsZW1lbnQgdG8gYmUgcmVzaXplZC5cbiAgICAgKi9cbiAgICByZXNpemVJZnJhbWUob2JqKSB7XG4gICAgICBvYmouc3R5bGUuaGVpZ2h0ID0gMDtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSBvYmouY29udGVudFdpbmRvdy5kb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCArICdweCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBsb2FkZXIgSFRNTFxuICAgICAqIEBtZW1iZXJvZiBJRnJhbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExvYWRlckhUTUwoKSB7XG4gICAgICByZXR1cm4gJzwhZG9jdHlwZSBodG1sPjxodG1sPjxzdHlsZT5ib2R5e2hlaWdodDogMTAwcHg7fS5jcy1sb2FkZXJ7aGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTt9LmNzLWxvYWRlci1pbm5lcnt0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7IHRvcDogNTAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiBjYWxjKDEwMCUgLSAyMDBweCk7IGNvbG9yOiAjQTJBM0EzOyBwYWRkaW5nOiAwIDEwMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWx7Zm9udC1zaXplOiAyMHB4OyBvcGFjaXR5OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fUBrZXlmcmFtZXMgbG9sezAle29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9MTAwJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319QC13ZWJraXQta2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9NjYle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNil7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDUpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg0KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMyl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDIpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgNDAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgxKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9PC9zdHlsZT48Ym9keT4gPGRpdiBjbGFzcz1cImNzLWxvYWRlclwiPiA8ZGl2IGNsYXNzPVwiY3MtbG9hZGVyLWlubmVyXCI+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRlY29kZWQgSFRNTCBlbnRpdGllc1xuICAgICAqIEBtZW1iZXJvZiBJRnJhbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIEhUTUwgZW50aXRpZXNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGRlY29kZUh0bWxFbnRpdGllcyhzdHIpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvJiM/KFxcdyspOy9nLCBmdW5jdGlvbihtYXRjaCwgZGVjKSB7XG4gICAgICAgIGlmIChpc05hTihkZWMpKSB7XG4gICAgICAgICAgdmFyIGNoYXJzID0ge1xuICAgICAgICAgICAgcXVvdDogMzQsXG4gICAgICAgICAgICBhbXA6IDM4LFxuICAgICAgICAgICAgbHQ6IDYwLFxuICAgICAgICAgICAgZ3Q6IDYyLFxuICAgICAgICAgICAgbmJzcDogMTYwLFxuICAgICAgICAgICAgY29weTogMTY5LFxuICAgICAgICAgICAgcmVnOiAxNzQsXG4gICAgICAgICAgICBkZWc6IDE3NixcbiAgICAgICAgICAgIGZyYXNsOiA0NyxcbiAgICAgICAgICAgIHRyYWRlOiA4NDgyLFxuICAgICAgICAgICAgZXVybzogODM2NCxcbiAgICAgICAgICAgIEFncmF2ZTogMTkyLFxuICAgICAgICAgICAgQWFjdXRlOiAxOTMsXG4gICAgICAgICAgICBBY2lyYzogMTk0LFxuICAgICAgICAgICAgQXRpbGRlOiAxOTUsXG4gICAgICAgICAgICBBdW1sOiAxOTYsXG4gICAgICAgICAgICBBcmluZzogMTk3LFxuICAgICAgICAgICAgQUVsaWc6IDE5OCxcbiAgICAgICAgICAgIENjZWRpbDogMTk5LFxuICAgICAgICAgICAgRWdyYXZlOiAyMDAsXG4gICAgICAgICAgICBFYWN1dGU6IDIwMSxcbiAgICAgICAgICAgIEVjaXJjOiAyMDIsXG4gICAgICAgICAgICBFdW1sOiAyMDMsXG4gICAgICAgICAgICBJZ3JhdmU6IDIwNCxcbiAgICAgICAgICAgIElhY3V0ZTogMjA1LFxuICAgICAgICAgICAgSWNpcmM6IDIwNixcbiAgICAgICAgICAgIEl1bWw6IDIwNyxcbiAgICAgICAgICAgIEVUSDogMjA4LFxuICAgICAgICAgICAgTnRpbGRlOiAyMDksXG4gICAgICAgICAgICBPZ3JhdmU6IDIxMCxcbiAgICAgICAgICAgIE9hY3V0ZTogMjExLFxuICAgICAgICAgICAgT2NpcmM6IDIxMixcbiAgICAgICAgICAgIE90aWxkZTogMjEzLFxuICAgICAgICAgICAgT3VtbDogMjE0LFxuICAgICAgICAgICAgdGltZXM6IDIxNSxcbiAgICAgICAgICAgIE9zbGFzaDogMjE2LFxuICAgICAgICAgICAgVWdyYXZlOiAyMTcsXG4gICAgICAgICAgICBVYWN1dGU6IDIxOCxcbiAgICAgICAgICAgIFVjaXJjOiAyMTksXG4gICAgICAgICAgICBVdW1sOiAyMjAsXG4gICAgICAgICAgICBZYWN1dGU6IDIyMSxcbiAgICAgICAgICAgIFRIT1JOOiAyMjIsXG4gICAgICAgICAgICBzemxpZzogMjIzLFxuICAgICAgICAgICAgYWdyYXZlOiAyMjQsXG4gICAgICAgICAgICBhYWN1dGU6IDIyNSxcbiAgICAgICAgICAgIGFjaXJjOiAyMjYsXG4gICAgICAgICAgICBhdGlsZGU6IDIyNyxcbiAgICAgICAgICAgIGF1bWw6IDIyOCxcbiAgICAgICAgICAgIGFyaW5nOiAyMjksXG4gICAgICAgICAgICBhZWxpZzogMjMwLFxuICAgICAgICAgICAgY2NlZGlsOiAyMzEsXG4gICAgICAgICAgICBlZ3JhdmU6IDIzMixcbiAgICAgICAgICAgIGVhY3V0ZTogMjMzLFxuICAgICAgICAgICAgZWNpcmM6IDIzNCxcbiAgICAgICAgICAgIGV1bWw6IDIzNSxcbiAgICAgICAgICAgIGlncmF2ZTogMjM2LFxuICAgICAgICAgICAgaWFjdXRlOiAyMzcsXG4gICAgICAgICAgICBpY2lyYzogMjM4LFxuICAgICAgICAgICAgaXVtbDogMjM5LFxuICAgICAgICAgICAgZXRoOiAyNDAsXG4gICAgICAgICAgICBudGlsZGU6IDI0MSxcbiAgICAgICAgICAgIG9ncmF2ZTogMjQyLFxuICAgICAgICAgICAgb2FjdXRlOiAyNDMsXG4gICAgICAgICAgICBvY2lyYzogMjQ0LFxuICAgICAgICAgICAgb3RpbGRlOiAyNDUsXG4gICAgICAgICAgICBvdW1sOiAyNDYsXG4gICAgICAgICAgICBkaXZpZGU6IDI0NyxcbiAgICAgICAgICAgIG9zbGFzaDogMjQ4LFxuICAgICAgICAgICAgdWdyYXZlOiAyNDksXG4gICAgICAgICAgICB1YWN1dGU6IDI1MCxcbiAgICAgICAgICAgIHVjaXJjOiAyNTEsXG4gICAgICAgICAgICB1dW1sOiAyNTIsXG4gICAgICAgICAgICB5YWN1dGU6IDI1MyxcbiAgICAgICAgICAgIHRob3JuOiAyNTQsXG4gICAgICAgICAgICB5dW1sOiAyNTUsXG4gICAgICAgICAgICBsc3F1bzogODIxNixcbiAgICAgICAgICAgIHJzcXVvOiA4MjE3LFxuICAgICAgICAgICAgc2JxdW86IDgyMTgsXG4gICAgICAgICAgICBsZHF1bzogODIyMCxcbiAgICAgICAgICAgIHJkcXVvOiA4MjIxLFxuICAgICAgICAgICAgYmRxdW86IDgyMjIsXG4gICAgICAgICAgICBkYWdnZXI6IDgyMjQsXG4gICAgICAgICAgICBEYWdnZXI6IDgyMjUsXG4gICAgICAgICAgICBwZXJtaWw6IDgyNDAsXG4gICAgICAgICAgICBsc2FxdW86IDgyNDksXG4gICAgICAgICAgICByc2FxdW86IDgyNTAsXG4gICAgICAgICAgICBzcGFkZXM6IDk4MjQsXG4gICAgICAgICAgICBjbHViczogOTgyNyxcbiAgICAgICAgICAgIGhlYXJ0czogOTgyOSxcbiAgICAgICAgICAgIGRpYW1zOiA5ODMwLFxuICAgICAgICAgICAgb2xpbmU6IDgyNTQsXG4gICAgICAgICAgICBsYXJyOiA4NTkyLFxuICAgICAgICAgICAgdWFycjogODU5MyxcbiAgICAgICAgICAgIHJhcnI6IDg1OTQsXG4gICAgICAgICAgICBkYXJyOiA4NTk1LFxuICAgICAgICAgICAgaGVsbGlwOiAxMzMsXG4gICAgICAgICAgICBuZGFzaDogMTUwLFxuICAgICAgICAgICAgbWRhc2g6IDE1MSxcbiAgICAgICAgICAgIGlleGNsOiAxNjEsXG4gICAgICAgICAgICBjZW50OiAxNjIsXG4gICAgICAgICAgICBwb3VuZDogMTYzLFxuICAgICAgICAgICAgY3VycmVuOiAxNjQsXG4gICAgICAgICAgICB5ZW46IDE2NSxcbiAgICAgICAgICAgIGJydmJhcjogMTY2LFxuICAgICAgICAgICAgYnJrYmFyOiAxNjYsXG4gICAgICAgICAgICBzZWN0OiAxNjcsXG4gICAgICAgICAgICB1bWw6IDE2OCxcbiAgICAgICAgICAgIGRpZTogMTY4LFxuICAgICAgICAgICAgb3JkZjogMTcwLFxuICAgICAgICAgICAgbGFxdW86IDE3MSxcbiAgICAgICAgICAgIG5vdDogMTcyLFxuICAgICAgICAgICAgc2h5OiAxNzMsXG4gICAgICAgICAgICBtYWNyOiAxNzUsXG4gICAgICAgICAgICBoaWJhcjogMTc1LFxuICAgICAgICAgICAgcGx1c21uOiAxNzcsXG4gICAgICAgICAgICBzdXAyOiAxNzgsXG4gICAgICAgICAgICBzdXAzOiAxNzksXG4gICAgICAgICAgICBhY3V0ZTogMTgwLFxuICAgICAgICAgICAgbWljcm86IDE4MSxcbiAgICAgICAgICAgIHBhcmE6IDE4MixcbiAgICAgICAgICAgIG1pZGRvdDogMTgzLFxuICAgICAgICAgICAgY2VkaWw6IDE4NCxcbiAgICAgICAgICAgIHN1cDE6IDE4NSxcbiAgICAgICAgICAgIG9yZG06IDE4NixcbiAgICAgICAgICAgIHJhcXVvOiAxODcsXG4gICAgICAgICAgICBmcmFjMTQ6IDE4OCxcbiAgICAgICAgICAgIGZyYWMxMjogMTg5LFxuICAgICAgICAgICAgZnJhYzM0OiAxOTAsXG4gICAgICAgICAgICBpcXVlc3Q6IDE5MSxcbiAgICAgICAgICAgIEFscGhhOiA5MTMsXG4gICAgICAgICAgICBhbHBoYTogOTQ1LFxuICAgICAgICAgICAgQmV0YTogOTE0LFxuICAgICAgICAgICAgYmV0YTogOTQ2LFxuICAgICAgICAgICAgR2FtbWE6IDkxNSxcbiAgICAgICAgICAgIGdhbW1hOiA5NDcsXG4gICAgICAgICAgICBEZWx0YTogOTE2LFxuICAgICAgICAgICAgZGVsdGE6IDk0OCxcbiAgICAgICAgICAgIEVwc2lsb246IDkxNyxcbiAgICAgICAgICAgIGVwc2lsb246IDk0OSxcbiAgICAgICAgICAgIFpldGE6IDkxOCxcbiAgICAgICAgICAgIHpldGE6IDk1MCxcbiAgICAgICAgICAgIEV0YTogOTE5LFxuICAgICAgICAgICAgZXRhOiA5NTEsXG4gICAgICAgICAgICBUaGV0YTogOTIwLFxuICAgICAgICAgICAgdGhldGE6IDk1MixcbiAgICAgICAgICAgIElvdGE6IDkyMSxcbiAgICAgICAgICAgIGlvdGE6IDk1MyxcbiAgICAgICAgICAgIEthcHBhOiA5MjIsXG4gICAgICAgICAgICBrYXBwYTogOTU0LFxuICAgICAgICAgICAgTGFtYmRhOiA5MjMsXG4gICAgICAgICAgICBsYW1iZGE6IDk1NSxcbiAgICAgICAgICAgIE11OiA5MjQsXG4gICAgICAgICAgICBtdTogOTU2LFxuICAgICAgICAgICAgTnU6IDkyNSxcbiAgICAgICAgICAgIG51OiA5NTcsXG4gICAgICAgICAgICBYaTogOTI2LFxuICAgICAgICAgICAgeGk6IDk1OCxcbiAgICAgICAgICAgIE9taWNyb246IDkyNyxcbiAgICAgICAgICAgIG9taWNyb246IDk1OSxcbiAgICAgICAgICAgIFBpOiA5MjgsXG4gICAgICAgICAgICBwaTogOTYwLFxuICAgICAgICAgICAgUmhvOiA5MjksXG4gICAgICAgICAgICByaG86IDk2MSxcbiAgICAgICAgICAgIFNpZ21hOiA5MzEsXG4gICAgICAgICAgICBzaWdtYTogOTYzLFxuICAgICAgICAgICAgVGF1OiA5MzIsXG4gICAgICAgICAgICB0YXU6IDk2NCxcbiAgICAgICAgICAgIFVwc2lsb246IDkzMyxcbiAgICAgICAgICAgIHVwc2lsb246IDk2NSxcbiAgICAgICAgICAgIFBoaTogOTM0LFxuICAgICAgICAgICAgcGhpOiA5NjYsXG4gICAgICAgICAgICBDaGk6IDkzNSxcbiAgICAgICAgICAgIGNoaTogOTY3LFxuICAgICAgICAgICAgUHNpOiA5MzYsXG4gICAgICAgICAgICBwc2k6IDk2OCxcbiAgICAgICAgICAgIE9tZWdhOiA5MzcsXG4gICAgICAgICAgICBvbWVnYTogOTY5XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChjaGFyc1tkZWNdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlYyA9IGNoYXJzW2RlY107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGRlYyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2VDbGFzcztcbiIsImNvbnN0IE1ldGlzYURvbSA9IHJlcXVpcmUoJy4vTWV0aXNhL2RvbScpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5cbi8qKlxuICogTG9hZHMgalF1ZXJ5IGFuZCB7QGxpbmsgTWV0aXNhRG9tfSBvYmplY3QgaW50byB3aW5kb3cgb2JqZWN0IGluIGJyb3dzZXJcbiAqIFxuICogQHJlcXVpcmVzIE1ldGlzYURvbVxuICogQHJlcXVpcmVzIGdldFV0aWxcbiAqL1xuZnVuY3Rpb24gYnJvd3NlcigpIHtcbiAgaWYgKHV0aWwuZW52aXJvbm1lbnQgIT09ICdicm93c2VyJyApIHtcbiAgICByZXR1cm4gY29uc29sZS53YXJuKCdNZXRpc2EgYnJvd3NlciBjYW4gb25seSBydW4gaW5zaWRlIGEgYnJvd3NlcicpO1xuICB9XG4gIHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9ICQgfHwgalF1ZXJ5IHx8IHt9O1xuXG4gIHdpbmRvdy5NZXRpc2EgPSBuZXcgTWV0aXNhRG9tKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKGJyb3dzZXIpKCk7XG4iLCIvKipcbiAqIEdldHMgU0RLIHV0aWxpdGllc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7VXRpbE9ian1cbiAqL1xuZnVuY3Rpb24gZ2V0VXRpbCgpIHtcbiAgLyoqXG4gICAqIE9iamVjdCBjb250YWluaW5nIHV0aWxpbGl0aWVzXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IFV0aWxPYmpcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVudmlyb25tZW50IEVudmlyb25tZW50IHRoYXQgTWV0aXNhIG9iamVjdCBpcyBleHBvc2VkIHRvLiBSZXR1cm5zIGAnYnJvd3NlcidgIG9yIGBub2RlYC5cbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gY29tcG9zZSBbRnVuY3Rpb25dKCNnZXR1dGlsY29tcG9zZWZ1bmNvcmlnaW5hbC3ih5ItY2xhc3MpIGZvciBjb21wb3NpbmcgY2xhc3Nlc1xuICAgKiBAbWVtYmVyb2YgZ2V0VXRpbFxuICAgKi9cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wb3NlZCBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtICB7Y2xhc3N9IG9yaWdpbmFsIENsYXNzIHRvIGJlIGNvbXBvc2VkIHRvLlxuICAgKiBAcmV0dXJuIHtjbGFzc31cbiAgICovXG4gIHZhciBjb21wb3NlRnVuYyA9IGZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY29tcG9zaXRpb25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBjb21wb3NlZCA9IG9yaWdpbmFsO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29tcG9zZWQgPSBjb21wb3NpdGlvbnNbaV0oY29tcG9zZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbXBvc2VkO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBlbnZpcm9ubWVudDogdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyAnYnJvd3NlcicgOiAnbm9kZScsXG4gICAgY29tcG9zZTogY29tcG9zZUZ1bmMsXG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IChnZXRVdGlsKSgpO1xuIl19
