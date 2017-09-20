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
      crossDomain: true,
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
      crossDomain: true,
      dataType: 'jsonp',
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
 * @param  {class} `composedClass` to be composed.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogT3B0aW9ucyBvYmplY3QgZGVmaW5pdGlvblxuICogQHByaXZhdGVcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE9wdHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiYXNlVXJsPWh0dHBzOi8vYXNrbWV0aXNhLmNvbS8gQmFzZSBVUkwgb2YgQVBJXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcHJvZHVjdEVuZHBvaW50PS9hcGkvdjEvcHJvZHVjdC1jb2xsZWN0aW9uIFBhdGggb2YgQVBJIGVuZHBvaW50IGZvciBjcmVhdGluZyBvciB1cGRhdGluZyBwcm9kdWN0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IG9yZGVyRW5kcG9pbnQ9L2FwaS92MS9vcmRlci10cmFuc2FjdGlvbiBQYXRoIG9mIEFQSSBlbmRwb2ludCBmb3IgY3JlYXRpbmcgb3IgdXBkYXRpbmcgb3JkZXJzXG4gKi9cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEJhc2UgY2xhc3MgZm9yIGFueSBlbnZpcm9ubWVudC5cblxuICovXG5jbGFzcyBNZXRpc2Ege1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgTWV0aXNhYCB3aXRoIGBvcHRzYC5cbiAgICogQHBhcmFtIHtPcHRzfSBvcHRzIE9wdGlvbiBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIE1ldGlzYSBjb250cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbihcbiAgICB7XG4gICAgICAgIGJhc2VVcmw6ICdodHRwczovL2Fza21ldGlzYS5jb20vJyxcbiAgICAgICAgcHJvZHVjdEVuZHBvaW50OiBcIi9hcGkvdjEvcHJvZHVjdC1jb2xsZWN0aW9uXCIsXG4gICAgICAgIG9yZGVyRW5kcG9pbnQ6IFwiL2FwaS92MS9vcmRlci10cmFuc2FjdGlvblwiLFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIHRoaXMuZGVidWcgPSB0cnVlO1xuICAgIGNvbnNvbGUubG9nKGBpbml0aWFsaXNlZCBNZXRpc2Egd2l0aCAke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9IWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIGl0IGlzIHJlYWR5IHRvIHN0YXJ0IGNhbGxpbmcgQVBJLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpc1JlYWR5VG9TdGFydCgpIHtcbiAgICB2YXIgaXNSZWFkeSA9IGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBvcHRpb25zIGZyb20gYG10KCd7eyBvcHRpb24gfX0nLCB7eyB2YWx1ZSB9fSlgLlxuICAgKi9cbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xuICAgIGlmIChhcmd1bWVudHNbMF0gPT09ICdiYXNlVXJsJykge1xuICAgICAgLy8gSW5pdCBCYXNlIFVSTCBmb3IgdGVzdGluZ1xuICAgICAgdGhpcy5sb2coJ0Jhc2UgVVJMIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMub3B0cy5iYXNlVXJsID0gYXJndW1lbnRzWzFdOyAvLyBvdmVycmlkZVxuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAncHJvZHVjdCcpIHtcbiAgICAgIC8vIEluaXQgUHJvZHVjdCBvYmplY3RcbiAgICAgIHRoaXMubG9nKCdQcm9kdWN0IGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMucHJvZHVjdCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ29yZGVyJykge1xuICAgICAgLy8gSW5pdCBPcmRlciBvYmplY3RcbiAgICAgIHRoaXMubG9nKCdPcmRlciBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLm9yZGVyID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnc3RvcmUnKSB7XG4gICAgICAvLyBJbml0IHN0b3JlIHNsdWdcbiAgICAgIHRoaXMubG9nKCdTdG9yZSBzbHVnIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuc2x1ZyA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgLy8gSW5pdCB1c2VyIGJhc2VkIHJlY29tbWVuZGF0aW9uc1xuICAgICAgdGhpcy5sb2coJ0N1c3RvbWVyX2lkIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuY3VzdG9tZXJJZCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2NhdGVnb3J5Jykge1xuICAgICAgLy8gSW5pdCBjYXRlZ29yeVxuICAgICAgdGhpcy5sb2coJ0NhdGVnb3J5IGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuY2F0ZWdvcnlOYW1lID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnYnJhbmQnKSB7XG4gICAgICAvLyBJbml0IGJyYW5kXG4gICAgICB0aGlzLmxvZygnQnJhbmQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5icmFuZG5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdwcm9kdWN0SWQnKSB7XG4gICAgICAvLyBJbml0IHByb2R1Y3QgaWRcbiAgICAgIHRoaXMubG9nKCdQcm9kdWN0IElEIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMucHJvZHVjdElkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnZ2VuZGVyJykge1xuICAgICAgLy8gSW5pdCBnZW5kZXJcbiAgICAgIHRoaXMubG9nKCdHZW5kZXIgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5nZW5kZXIgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdzZXNzaW9uJykge1xuICAgICAgLy8gSW5pdCBzZXNzaW9uXG4gICAgICB0aGlzLmxvZygnU2Vzc2lvbiBpcycsIGFyZ3VtZW50c1sxXSlcbiAgICAgIHRoaXMuc2Vzc2lvbklkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnbGFuZ3VhZ2UnKSB7XG4gICAgICB0aGlzLmxvZygnTGFuZ3VhZ2UgaXMnLCBhcmd1bWVudHNbMV0pXG4gICAgICB0aGlzLmxhbmd1YWdlID0gYXJndW1lbnRzWzFdO1xuICAgIH1cbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gTWV0aXNhO1xuIiwidmFyIE1ldGlzYUNvcmUgPSByZXF1aXJlKCcuLi9jb3JlJyk7XG52YXIgd2l0aElGcmFtZSA9IHJlcXVpcmUoJy4vd2l0aElGcmFtZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlsJyk7XG52YXIgY29tcG9zZSA9IHV0aWwuY29tcG9zZTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIHtAbGluayBNZXRpc2F9IGNsYXNzIHRoYXQgY29tcG9zZXMgd2l0aCB7QGxpbmsgY29tcG9zZUNsYXNzLklGcmFtZX1cbiAqIEByZXF1aXJlcyBNZXRpc2FcbiAqIEByZXF1aXJlcyBjb21wb3NlQ2xhc3NcbiAqIEByZXF1aXJlcyBnZXRVdGlsLmNvbXBvc2VcbiAqL1xudmFyIE1ldGlzYXdpdGhJRnJhbWUgPSBjb21wb3NlKE1ldGlzYUNvcmUpKHdpdGhJRnJhbWUpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgYnJvd3NlciBlbnZpcm9ubWVudC4gVGhpcyBpcyBpbml0aWFsaXNlZCBhbmQgZXhwb3NlZCB0byBgd2luZG93Lk1ldGlzYWAgd2hlbiB5b3UgaW1wb3J0IHRocm91Z2ggb3VyIFtleGFtcGxlXSgvI2luc3RhbGxhdGlvbikuXG4gKiBAZXh0ZW5kcyBNZXRpc2F3aXRoSUZyYW1lXG4gKi9cbmNsYXNzIE1ldGlzYURvbSBleHRlbmRzIE1ldGlzYXdpdGhJRnJhbWUge1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgTWV0aXNhRG9tYCB3aXRoIGBvcHRzYC5cbiAgICogQHBhcmFtIHtPcHRzfSBvcHRzIE9wdGlvbiBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIE1ldGlzYURvbSBjb250cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgaWYgKCQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIERvbSByZXF1aXJlcyBqUXVlcnkgdG8gYmUgYXZhaWxhYmxlIScpXG4gICAgfVxuICAgIHN1cGVyKG9wdHMpO1xuXG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSBEb20gd2l0aCAke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9IWApO1xuICAgIHRoaXMucmVuZGVyV2lkZ2V0ID0gdGhpcy5yZW5kZXJXaWRnZXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyT3B0aW9ucyA9IHRoaXMucmVnaXN0ZXJPcHRpb25zLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmF0dGFjaFJlZ2lzdGVyT3B0aW9uc1RvV2luZG93KCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgcmVnaXN0ZXJlZCBvcHRpb25zIHRvIGB3aW5kb3cubXRgLlxuICAgKi9cbiAgYXR0YWNoUmVnaXN0ZXJPcHRpb25zVG9XaW5kb3coKSB7XG4gICAgd2luZG93Lm10ID0gdGhpcy5yZWdpc3Rlck9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWBhbmQgZGV0ZXJtaW5lcyB3aGV0aGVyIHByb2R1Y3Qgb3Igb3JkZXIgZGF0YSBzaG91bGQgYmUgaGFuZGxlZC5cbiAgICovXG4gIHJlZ2lzdGVyT3B0aW9ucygpIHtcbiAgICBzdXBlci5yZWdpc3Rlck9wdGlvbnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGlmICh0aGlzLmlzUmVhZHlUb1N0YXJ0KSB7XG4gICAgICB0aGlzLnJlbmRlcldpZGdldCgpO1xuICAgICAgaWYgKHRoaXMucHJvZHVjdCkge1xuICAgICAgICB0aGlzLnRyYWNrKCdwcm9kdWN0JywgdGhpcy5wcm9kdWN0KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5vcmRlcikge1xuICAgICAgICB0aGlzLnRyYWNrKCdvcmRlcicsIHRoaXMub3JkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIE1ldGlzYSB3aWRnZXRzIGluIHRoZSBicm93c2VyLlxuICAgKi9cbiAgcmVuZGVyV2lkZ2V0KCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIHdpZGdldHMgPSAkKCcubXQtd2lkZ2V0Jyk7XG5cbiAgICAvLyBDb252ZXJ0IHdpZGdldHMgbm9kZWxpc3QgdG8gdHJ1ZSBhcnJheVxuICAgIHdpZGdldHMgPSAkLm1ha2VBcnJheSh3aWRnZXRzKTtcblxuICAgIHdpZGdldHMuZm9yRWFjaChmdW5jdGlvbih3aWRnZXQpIHtcbiAgICAgIC8vIFJlbmRlciB3aWRnZXQgdXNpbmcgQWpheCBzbyB3ZSBjYW4gZ3JhY2VmdWxseSBkZWdyYWRlIGlmIHRoZXJlIGlzIG5vIGNvbnRlbnQgYXZhaWxhYmxlXG4gICAgICB2YXIgd2lkZ2V0SWQgPSB3aWRnZXQuZGF0YXNldC53aWRnZXRJZCxcbiAgICAgICAgY3VzdG9tZXJJZCA9IHdpZGdldC5kYXRhc2V0LmN1c3RvbWVySWQsXG4gICAgICAgIHByb2R1Y3RJZCA9IHdpZGdldC5kYXRhc2V0LnByb2R1Y3RJZCxcbiAgICAgICAgY2F0ZWdvcnlOYW1lID0gd2lkZ2V0LmRhdGFzZXQuY2F0ZWdvcnlOYW1lLFxuICAgICAgICBicmFuZG5hbWUgPSB3aWRnZXQuZGF0YXNldC5icmFuZG5hbWUsXG4gICAgICAgIHNlc3Npb25JZCA9IHdpZGdldC5kYXRhc2V0LnNlc3Npb25JZCxcbiAgICAgICAgbGFuZ3VhZ2UgPSB3aWRnZXQuZGF0YXNldC5sYW5ndWFnZSxcbiAgICAgICAgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyAnL2FwaS92MS93aWRnZXQtY3VzdG9tZXI/d2lkZ2V0X2lkPScgKyB3aWRnZXRJZDtcblxuICAgICAgLy8gT3ZlcnJpZGUgY3VzdG9tZXIsIGNhdGVnb3J5IG9yIGJyYW5kXG4gICAgICBpZiAoY3VzdG9tZXJJZCkgdGhpcy5jdXN0b21lcklkID0gY3VzdG9tZXJJZDtcbiAgICAgIGlmIChwcm9kdWN0SWQpIHRoaXMucHJvZHVjdElkID0gcHJvZHVjdElkO1xuICAgICAgaWYgKGNhdGVnb3J5TmFtZSkgdGhpcy5jYXRlZ29yeU5hbWUgPSBjYXRlZ29yeU5hbWU7XG4gICAgICBpZiAoYnJhbmRuYW1lKSB0aGlzLmJyYW5kbmFtZSA9IGJyYW5kbmFtZTtcbiAgICAgIGlmIChzZXNzaW9uSWQpIHRoaXMuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgICAgaWYgKGxhbmd1YWdlKSB0aGlzLmxhbmd1YWdlID0gbGFuZ3VhZ2U7XG5cbiAgICAgIGlmICh0aGlzLmN1c3RvbWVySWQpIHtcbiAgICAgICAgdXJsICs9ICcmY3VzdG9tZXJfaWQ9JyArIGVzY2FwZSh0aGlzLmN1c3RvbWVySWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wcm9kdWN0SWQpIHtcbiAgICAgICAgdXJsICs9ICcmcHJvZHVjdF9pZD0nICsgZXNjYXBlKHRoaXMucHJvZHVjdElkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2F0ZWdvcnlOYW1lKSB7XG4gICAgICAgIHVybCArPSAnJmNhdGVnb3J5X25hbWU9JyArIGVzY2FwZSh0aGlzLmNhdGVnb3J5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJyYW5kbmFtZSkge1xuICAgICAgICB1cmwgKz0gJyZicmFuZG5hbWU9JyArIGVzY2FwZSh0aGlzLmJyYW5kbmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmdlbmRlcikge1xuICAgICAgICB1cmwgKz0gJyZnZW5kZXI9JyArIGVzY2FwZSh0aGlzLmdlbmRlcik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlc3Npb25JZCkge1xuICAgICAgICB1cmwgKz0gJyZzZXNzaW9uX2lkPScgKyBlc2NhcGUodGhpcy5zZXNzaW9uSWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYW5ndWFnZSkge1xuICAgICAgICB1cmwgKz0gJyZsYW5ndWFnZT0nICsgZXNjYXBlKHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgfVxuXG4gICAgICB1cmwgKz0gJyZmb3JtYXQ9aHRtbCc7XG4gICAgICAvLyBQcmVwYXJlIGlmcmFtZVxuICAgICAgdmFyIGlmcmFtZSA9IHNlbGYuY3JlYXRlSUZyYW1lV2l0aElkKHdpZGdldElkKTtcblxuICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgIC8vIFJlbmRlciBsb2FkZXJcbiAgICAgIHZhciBodG1sID0gc2VsZi5nZXRMb2FkZXJIVE1MKCk7XG5cbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSlcbiAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAvLyBEZWxldGUgbG9hZGVyIGlmcmFtZVxuICAgICAgICB2YXIgb2xkSUZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpZGdldC0nICtcbiAgICAgICAgd2lkZ2V0SWQpO1xuXG4gICAgICAgIHZhciBpZnJhbWVQYXJlbnQgPSBvbGRJRnJhbWUucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAoaWZyYW1lUGFyZW50KSB7XG4gICAgICAgICAgd2hpbGUgKGlmcmFtZVBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBpZnJhbWVQYXJlbnQucmVtb3ZlQ2hpbGQoaWZyYW1lUGFyZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgaWZyYW1lIGZvciB3aWRnZXRcbiAgICAgICAgdmFyIGlmcmFtZSA9IHNlbGYuY3JlYXRlSUZyYW1lV2l0aElkKHdpZGdldElkKTtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHdpZGdldC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgICAgICAgdmFyIGh0bWwgPSBzZWxmLmRlY29kZUh0bWxFbnRpdGllcyhkYXRhKTtcblxuICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShodG1sKTtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmNsb3NlKCk7XG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMzBweCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEh0bWwgd2lsbCBiZSBlbXB0eSBpZiBzdG9yZSBoYXMgcnVuIG91dCBvZiBmcmVlIHNhbGVzIGNyZWRpdHMuXG4gICAgICAgICAgICAvLyBHcmFjZWZ1bGx5IGZhaWwgdG8gbG9hZCB3aWRnZXQgYnkgcmVtb3ZpbmcgdGhlIGlmcmFtZSBmcm9tIERPTS5cbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIHN0YXR1c1RleHQpO1xuICAgICAgICAgIC8vIFJlbW92ZSBpZnJhbWUgZnJvbSBET01cbiAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG4gIC8qKlxuICAgKiBTdGFydHMgdHJhY2tpbmcgYnkgc3VibWl0dGluZyBwcm9kdWN0IG9yIG9yZGVyIGRhdGEgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhdCBDYXRlZ29yeSBuYW1lIG9mIGRhdGEgKGFsbG93ZWQgdmFsdWVzOiBgXCJwcm9kdWN0XCJgLGBcIm9yZGVyXCJgKVxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBPYmplY3Qgb2YgcHJvZHVjdCBvciBvcmRlciBkYXRhXG4gICAqL1xuXG4gIHRyYWNrKGNhdCwgZGF0YSkge1xuICAgIGlmICh0aGlzLnNsdWcpIHtcbiAgICAgIGlmIChjYXQgPT09ICdwcm9kdWN0Jykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlUHJvZHVjdChkYXRhKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNhdCA9PT0gJ29yZGVyJykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlT3JkZXIoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcm9kdWN0IGlmIGl0IGRvZXMgbm90IGV4aXN0IGluIE1ldGlzYSBvciB1cGRhdGVzIHRoZSBwcm9kdWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvZHVjdERhdGEgW3Byb2R1Y3REYXRhXXtAbGluayBCUk9XU0VSL1NDSEVNQS5odG1sI3Byb2R1Y3QtZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgcHJvZHVjdCBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlUHJvZHVjdChkYXRhKSB7XG4gICAgdmFyIHVybCA9IHRoaXMub3B0cy5iYXNlVXJsICsgdGhpcy5zbHVnICsgdGhpcy5vcHRzLnByb2R1Y3RFbmRwb2ludDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyLCBzZXR0aW5ncykge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgfSxcbiAgICAgIHN0YXR1c0NvZGU6IHtcbiAgICAgICAgICA1MDA6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW50ZXJuYWwgc2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyt4aHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3JkZXIgaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIG9yZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3JkZXJEYXRhIFtvcmRlckRhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjb3JkZXItZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgb3JkZXIgQVBJIGVuZHBvaW50XG4gICAqL1xuICBjcmVhdGVPclVwZGF0ZU9yZGVyKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMub3JkZXJFbmRwb2ludDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICB9LFxuICAgICAgc3RhdHVzQ29kZToge1xuICAgICAgICAgIDUwMDogZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnK3hocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIGxvZ3MgdG8gYnJvd3NlciBjb25zb2xlIHdoZW4gYGRlYnVnYCBwcm9wZXJ0eSBvZiBgTWV0aXNhRG9tYCBvYmplY3QgaXMgYHRydWVgXG4gICAqL1xuICBsb2coKSB7XG4gICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXRpc2FEb207XG4iLCIvKipcbiAqIFJldHVybnMge0BsaW5rIGNvbXBvc2VDbGFzcy5JRnJhbWV9IGNvbXBvc2VkIHdpdGggYGNvbXBvc2VkQ2xhc3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gIHtjbGFzc30gYGNvbXBvc2VkQ2xhc3NgIHRvIGJlIGNvbXBvc2VkLlxuICogQHJldHVybnMge2NvbXBvc2VkQ2xhc3MuSUZyYW1lfVxuICovXG5cbnZhciBjb21wb3NlQ2xhc3MgPSBmdW5jdGlvbihjb21wb3NlZENsYXNzKSB7XG4gIC8qKlxuICAgKiBgPGlmcmFtZT5gIGVsZW1lbnQgaW4gdGhlIHJlY29tbWVuZGF0aW9uIHdpZGdldC5cbiAgICogQHR5cGVkZWYge09iamVjdH0gSUZyYW1lXG4gICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3NcbiAgICovXG4gIHJldHVybiBjbGFzcyBJRnJhbWUgZXh0ZW5kcyBjb21wb3NlZENsYXNzIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGBpZnJhbWVgIGVsZW1lbnRcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBSZWNvbW1lbmRhdGlvbiB3aWRnZXQgSURcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgY3JlYXRlSUZyYW1lV2l0aElkKGlkKSB7XG4gICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG5cbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2JvcmRlcjogMHB4OyB3aWR0aDogMTAwJTsnKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2ZyYW1lYm9yZGVyJywgJzAnKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3Njcm9sbGluZycsICdubycpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnb25sb2FkJywgJ3dpbmRvdy5NZXRpc2EucmVzaXplSWZyYW1lKHRoaXMpJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdpZCcsICd3aWRnZXQtJyArIGlkKTtcblxuICAgICAgcmV0dXJuIGlmcmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemVzIGBpZnJhbWVgIGVsZW1lbnRcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBgaWZyYW1lYCBlbGVtZW50IHRvIGJlIHJlc2l6ZWQuXG4gICAgICovXG4gICAgcmVzaXplSWZyYW1lKG9iaikge1xuICAgICAgb2JqLnN0eWxlLmhlaWdodCA9IDA7XG4gICAgICBvYmouc3R5bGUuaGVpZ2h0ID0gb2JqLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgbG9hZGVyIEhUTUxcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0TG9hZGVySFRNTCgpIHtcbiAgICAgIHJldHVybiAnPCFkb2N0eXBlIGh0bWw+PGh0bWw+PHN0eWxlPmJvZHl7aGVpZ2h0OiAxMDBweDt9LmNzLWxvYWRlcntoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlO30uY3MtbG9hZGVyLWlubmVye3RyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTsgdG9wOiA1MCU7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6IGNhbGMoMTAwJSAtIDIwMHB4KTsgY29sb3I6ICNBMkEzQTM7IHBhZGRpbmc6IDAgMTAwcHg7IHRleHQtYWxpZ246IGNlbnRlcjt9LmNzLWxvYWRlci1pbm5lciBsYWJlbHtmb250LXNpemU6IDIwcHg7IG9wYWNpdHk6IDA7IGRpc3BsYXk6IGlubGluZS1ibG9jazt9QGtleWZyYW1lcyBsb2x7MCV7b3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0zMDBweCk7fTMzJXtvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9NjYle29wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO30xMDAle29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgzMDBweCk7fX1ALXdlYmtpdC1rZXlmcmFtZXMgbG9sezAle29wYWNpdHk6IDA7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0zMDBweCk7fTMzJXtvcGFjaXR5OiAxOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO302NiV7b3BhY2l0eTogMTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9MTAwJXtvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgzMDBweCk7fX0uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg2KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNSl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAxMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDQpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMjAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgzKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDMwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMil7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyA0MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgNDAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDEpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgNTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O308L3N0eWxlPjxib2R5PiA8ZGl2IGNsYXNzPVwiY3MtbG9hZGVyXCI+IDxkaXYgY2xhc3M9XCJjcy1sb2FkZXItaW5uZXJcIj4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPC9kaXY+PC9kaXY+PC9ib2R5PjwvaHRtbD4nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZGVjb2RlZCBIVE1MIGVudGl0aWVzXG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIEhUTUwgZW50aXRpZXNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGRlY29kZUh0bWxFbnRpdGllcyhzdHIpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvJiM/KFxcdyspOy9nLCBmdW5jdGlvbihtYXRjaCwgZGVjKSB7XG4gICAgICAgIGlmIChpc05hTihkZWMpKSB7XG4gICAgICAgICAgdmFyIGNoYXJzID0ge1xuICAgICAgICAgICAgcXVvdDogMzQsXG4gICAgICAgICAgICBhbXA6IDM4LFxuICAgICAgICAgICAgbHQ6IDYwLFxuICAgICAgICAgICAgZ3Q6IDYyLFxuICAgICAgICAgICAgbmJzcDogMTYwLFxuICAgICAgICAgICAgY29weTogMTY5LFxuICAgICAgICAgICAgcmVnOiAxNzQsXG4gICAgICAgICAgICBkZWc6IDE3NixcbiAgICAgICAgICAgIGZyYXNsOiA0NyxcbiAgICAgICAgICAgIHRyYWRlOiA4NDgyLFxuICAgICAgICAgICAgZXVybzogODM2NCxcbiAgICAgICAgICAgIEFncmF2ZTogMTkyLFxuICAgICAgICAgICAgQWFjdXRlOiAxOTMsXG4gICAgICAgICAgICBBY2lyYzogMTk0LFxuICAgICAgICAgICAgQXRpbGRlOiAxOTUsXG4gICAgICAgICAgICBBdW1sOiAxOTYsXG4gICAgICAgICAgICBBcmluZzogMTk3LFxuICAgICAgICAgICAgQUVsaWc6IDE5OCxcbiAgICAgICAgICAgIENjZWRpbDogMTk5LFxuICAgICAgICAgICAgRWdyYXZlOiAyMDAsXG4gICAgICAgICAgICBFYWN1dGU6IDIwMSxcbiAgICAgICAgICAgIEVjaXJjOiAyMDIsXG4gICAgICAgICAgICBFdW1sOiAyMDMsXG4gICAgICAgICAgICBJZ3JhdmU6IDIwNCxcbiAgICAgICAgICAgIElhY3V0ZTogMjA1LFxuICAgICAgICAgICAgSWNpcmM6IDIwNixcbiAgICAgICAgICAgIEl1bWw6IDIwNyxcbiAgICAgICAgICAgIEVUSDogMjA4LFxuICAgICAgICAgICAgTnRpbGRlOiAyMDksXG4gICAgICAgICAgICBPZ3JhdmU6IDIxMCxcbiAgICAgICAgICAgIE9hY3V0ZTogMjExLFxuICAgICAgICAgICAgT2NpcmM6IDIxMixcbiAgICAgICAgICAgIE90aWxkZTogMjEzLFxuICAgICAgICAgICAgT3VtbDogMjE0LFxuICAgICAgICAgICAgdGltZXM6IDIxNSxcbiAgICAgICAgICAgIE9zbGFzaDogMjE2LFxuICAgICAgICAgICAgVWdyYXZlOiAyMTcsXG4gICAgICAgICAgICBVYWN1dGU6IDIxOCxcbiAgICAgICAgICAgIFVjaXJjOiAyMTksXG4gICAgICAgICAgICBVdW1sOiAyMjAsXG4gICAgICAgICAgICBZYWN1dGU6IDIyMSxcbiAgICAgICAgICAgIFRIT1JOOiAyMjIsXG4gICAgICAgICAgICBzemxpZzogMjIzLFxuICAgICAgICAgICAgYWdyYXZlOiAyMjQsXG4gICAgICAgICAgICBhYWN1dGU6IDIyNSxcbiAgICAgICAgICAgIGFjaXJjOiAyMjYsXG4gICAgICAgICAgICBhdGlsZGU6IDIyNyxcbiAgICAgICAgICAgIGF1bWw6IDIyOCxcbiAgICAgICAgICAgIGFyaW5nOiAyMjksXG4gICAgICAgICAgICBhZWxpZzogMjMwLFxuICAgICAgICAgICAgY2NlZGlsOiAyMzEsXG4gICAgICAgICAgICBlZ3JhdmU6IDIzMixcbiAgICAgICAgICAgIGVhY3V0ZTogMjMzLFxuICAgICAgICAgICAgZWNpcmM6IDIzNCxcbiAgICAgICAgICAgIGV1bWw6IDIzNSxcbiAgICAgICAgICAgIGlncmF2ZTogMjM2LFxuICAgICAgICAgICAgaWFjdXRlOiAyMzcsXG4gICAgICAgICAgICBpY2lyYzogMjM4LFxuICAgICAgICAgICAgaXVtbDogMjM5LFxuICAgICAgICAgICAgZXRoOiAyNDAsXG4gICAgICAgICAgICBudGlsZGU6IDI0MSxcbiAgICAgICAgICAgIG9ncmF2ZTogMjQyLFxuICAgICAgICAgICAgb2FjdXRlOiAyNDMsXG4gICAgICAgICAgICBvY2lyYzogMjQ0LFxuICAgICAgICAgICAgb3RpbGRlOiAyNDUsXG4gICAgICAgICAgICBvdW1sOiAyNDYsXG4gICAgICAgICAgICBkaXZpZGU6IDI0NyxcbiAgICAgICAgICAgIG9zbGFzaDogMjQ4LFxuICAgICAgICAgICAgdWdyYXZlOiAyNDksXG4gICAgICAgICAgICB1YWN1dGU6IDI1MCxcbiAgICAgICAgICAgIHVjaXJjOiAyNTEsXG4gICAgICAgICAgICB1dW1sOiAyNTIsXG4gICAgICAgICAgICB5YWN1dGU6IDI1MyxcbiAgICAgICAgICAgIHRob3JuOiAyNTQsXG4gICAgICAgICAgICB5dW1sOiAyNTUsXG4gICAgICAgICAgICBsc3F1bzogODIxNixcbiAgICAgICAgICAgIHJzcXVvOiA4MjE3LFxuICAgICAgICAgICAgc2JxdW86IDgyMTgsXG4gICAgICAgICAgICBsZHF1bzogODIyMCxcbiAgICAgICAgICAgIHJkcXVvOiA4MjIxLFxuICAgICAgICAgICAgYmRxdW86IDgyMjIsXG4gICAgICAgICAgICBkYWdnZXI6IDgyMjQsXG4gICAgICAgICAgICBEYWdnZXI6IDgyMjUsXG4gICAgICAgICAgICBwZXJtaWw6IDgyNDAsXG4gICAgICAgICAgICBsc2FxdW86IDgyNDksXG4gICAgICAgICAgICByc2FxdW86IDgyNTAsXG4gICAgICAgICAgICBzcGFkZXM6IDk4MjQsXG4gICAgICAgICAgICBjbHViczogOTgyNyxcbiAgICAgICAgICAgIGhlYXJ0czogOTgyOSxcbiAgICAgICAgICAgIGRpYW1zOiA5ODMwLFxuICAgICAgICAgICAgb2xpbmU6IDgyNTQsXG4gICAgICAgICAgICBsYXJyOiA4NTkyLFxuICAgICAgICAgICAgdWFycjogODU5MyxcbiAgICAgICAgICAgIHJhcnI6IDg1OTQsXG4gICAgICAgICAgICBkYXJyOiA4NTk1LFxuICAgICAgICAgICAgaGVsbGlwOiAxMzMsXG4gICAgICAgICAgICBuZGFzaDogMTUwLFxuICAgICAgICAgICAgbWRhc2g6IDE1MSxcbiAgICAgICAgICAgIGlleGNsOiAxNjEsXG4gICAgICAgICAgICBjZW50OiAxNjIsXG4gICAgICAgICAgICBwb3VuZDogMTYzLFxuICAgICAgICAgICAgY3VycmVuOiAxNjQsXG4gICAgICAgICAgICB5ZW46IDE2NSxcbiAgICAgICAgICAgIGJydmJhcjogMTY2LFxuICAgICAgICAgICAgYnJrYmFyOiAxNjYsXG4gICAgICAgICAgICBzZWN0OiAxNjcsXG4gICAgICAgICAgICB1bWw6IDE2OCxcbiAgICAgICAgICAgIGRpZTogMTY4LFxuICAgICAgICAgICAgb3JkZjogMTcwLFxuICAgICAgICAgICAgbGFxdW86IDE3MSxcbiAgICAgICAgICAgIG5vdDogMTcyLFxuICAgICAgICAgICAgc2h5OiAxNzMsXG4gICAgICAgICAgICBtYWNyOiAxNzUsXG4gICAgICAgICAgICBoaWJhcjogMTc1LFxuICAgICAgICAgICAgcGx1c21uOiAxNzcsXG4gICAgICAgICAgICBzdXAyOiAxNzgsXG4gICAgICAgICAgICBzdXAzOiAxNzksXG4gICAgICAgICAgICBhY3V0ZTogMTgwLFxuICAgICAgICAgICAgbWljcm86IDE4MSxcbiAgICAgICAgICAgIHBhcmE6IDE4MixcbiAgICAgICAgICAgIG1pZGRvdDogMTgzLFxuICAgICAgICAgICAgY2VkaWw6IDE4NCxcbiAgICAgICAgICAgIHN1cDE6IDE4NSxcbiAgICAgICAgICAgIG9yZG06IDE4NixcbiAgICAgICAgICAgIHJhcXVvOiAxODcsXG4gICAgICAgICAgICBmcmFjMTQ6IDE4OCxcbiAgICAgICAgICAgIGZyYWMxMjogMTg5LFxuICAgICAgICAgICAgZnJhYzM0OiAxOTAsXG4gICAgICAgICAgICBpcXVlc3Q6IDE5MSxcbiAgICAgICAgICAgIEFscGhhOiA5MTMsXG4gICAgICAgICAgICBhbHBoYTogOTQ1LFxuICAgICAgICAgICAgQmV0YTogOTE0LFxuICAgICAgICAgICAgYmV0YTogOTQ2LFxuICAgICAgICAgICAgR2FtbWE6IDkxNSxcbiAgICAgICAgICAgIGdhbW1hOiA5NDcsXG4gICAgICAgICAgICBEZWx0YTogOTE2LFxuICAgICAgICAgICAgZGVsdGE6IDk0OCxcbiAgICAgICAgICAgIEVwc2lsb246IDkxNyxcbiAgICAgICAgICAgIGVwc2lsb246IDk0OSxcbiAgICAgICAgICAgIFpldGE6IDkxOCxcbiAgICAgICAgICAgIHpldGE6IDk1MCxcbiAgICAgICAgICAgIEV0YTogOTE5LFxuICAgICAgICAgICAgZXRhOiA5NTEsXG4gICAgICAgICAgICBUaGV0YTogOTIwLFxuICAgICAgICAgICAgdGhldGE6IDk1MixcbiAgICAgICAgICAgIElvdGE6IDkyMSxcbiAgICAgICAgICAgIGlvdGE6IDk1MyxcbiAgICAgICAgICAgIEthcHBhOiA5MjIsXG4gICAgICAgICAgICBrYXBwYTogOTU0LFxuICAgICAgICAgICAgTGFtYmRhOiA5MjMsXG4gICAgICAgICAgICBsYW1iZGE6IDk1NSxcbiAgICAgICAgICAgIE11OiA5MjQsXG4gICAgICAgICAgICBtdTogOTU2LFxuICAgICAgICAgICAgTnU6IDkyNSxcbiAgICAgICAgICAgIG51OiA5NTcsXG4gICAgICAgICAgICBYaTogOTI2LFxuICAgICAgICAgICAgeGk6IDk1OCxcbiAgICAgICAgICAgIE9taWNyb246IDkyNyxcbiAgICAgICAgICAgIG9taWNyb246IDk1OSxcbiAgICAgICAgICAgIFBpOiA5MjgsXG4gICAgICAgICAgICBwaTogOTYwLFxuICAgICAgICAgICAgUmhvOiA5MjksXG4gICAgICAgICAgICByaG86IDk2MSxcbiAgICAgICAgICAgIFNpZ21hOiA5MzEsXG4gICAgICAgICAgICBzaWdtYTogOTYzLFxuICAgICAgICAgICAgVGF1OiA5MzIsXG4gICAgICAgICAgICB0YXU6IDk2NCxcbiAgICAgICAgICAgIFVwc2lsb246IDkzMyxcbiAgICAgICAgICAgIHVwc2lsb246IDk2NSxcbiAgICAgICAgICAgIFBoaTogOTM0LFxuICAgICAgICAgICAgcGhpOiA5NjYsXG4gICAgICAgICAgICBDaGk6IDkzNSxcbiAgICAgICAgICAgIGNoaTogOTY3LFxuICAgICAgICAgICAgUHNpOiA5MzYsXG4gICAgICAgICAgICBwc2k6IDk2OCxcbiAgICAgICAgICAgIE9tZWdhOiA5MzcsXG4gICAgICAgICAgICBvbWVnYTogOTY5XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChjaGFyc1tkZWNdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRlYyA9IGNoYXJzW2RlY107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGRlYyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2VDbGFzcztcbiIsImNvbnN0IE1ldGlzYURvbSA9IHJlcXVpcmUoJy4vTWV0aXNhL2RvbScpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5cbi8qKlxuICogTG9hZHMgalF1ZXJ5IGFuZCB7QGxpbmsgTWV0aXNhRG9tfSBvYmplY3QgaW50byB3aW5kb3cgb2JqZWN0IGluIGJyb3dzZXJcbiAqIEBwcml2YXRlXG4gKiBAcmVxdWlyZXMgTWV0aXNhRG9tXG4gKiBAcmVxdWlyZXMgZ2V0VXRpbFxuICovXG5mdW5jdGlvbiBicm93c2VyKCkge1xuICBpZiAodXRpbC5lbnZpcm9ubWVudCAhPT0gJ2Jyb3dzZXInICkge1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oJ01ldGlzYSBicm93c2VyIGNhbiBvbmx5IHJ1biBpbnNpZGUgYSBicm93c2VyJyk7XG4gIH1cbiAgd2luZG93LmpRdWVyeSA9IHdpbmRvdy4kID0gJCB8fCBqUXVlcnkgfHwge307XG5cbiAgd2luZG93Lk1ldGlzYSA9IG5ldyBNZXRpc2FEb20oKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoYnJvd3NlcikoKTtcbiIsIi8qKlxuICogR2V0cyBTREsgdXRpbGl0aWVzXG4gKlxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtVdGlsT2JqfVxuICovXG5mdW5jdGlvbiBnZXRVdGlsKCkge1xuICAvKipcbiAgICogT2JqZWN0IGNvbnRhaW5pbmcgdXRpbGlsaXRpZXNcbiAgICogQHR5cGVkZWYge09iamVjdH0gVXRpbE9ialxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gZW52aXJvbm1lbnQgRW52aXJvbm1lbnQgdGhhdCBNZXRpc2Egb2JqZWN0IGlzIGV4cG9zZWQgdG8uIFJldHVybnMgYCdicm93c2VyJ2Agb3IgYG5vZGVgLlxuICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBjb21wb3NlIFtGdW5jdGlvbl0oI2dldHV0aWxjb21wb3NlZnVuY29yaWdpbmFsLeKHki1jbGFzcykgZm9yIGNvbXBvc2luZyBjbGFzc2VzXG4gICAqIEBtZW1iZXJvZiBnZXRVdGlsXG4gICAqL1xuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXBvc2VkIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtjbGFzc30gb3JpZ2luYWwgQ2xhc3MgdG8gYmUgY29tcG9zZWQgdG8uXG4gICAqIEByZXR1cm4ge2NsYXNzfVxuICAgKi9cbiAgdmFyIGNvbXBvc2VGdW5jID0gZnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjb21wb3NpdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIGNvbXBvc2VkID0gb3JpZ2luYWw7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb21wb3NlZCA9IGNvbXBvc2l0aW9uc1tpXShjb21wb3NlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcG9zZWQ7XG4gICAgfVxuICB9O1xuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50OiB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/ICdicm93c2VyJyA6ICdub2RlJyxcbiAgICBjb21wb3NlOiBjb21wb3NlRnVuYyxcbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gKGdldFV0aWwpKCk7XG4iXX0=
