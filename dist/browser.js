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
        crossDomain: true,
        dataType: 'jsonp',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBPcHRpb25zIG9iamVjdCBkZWZpbml0aW9uXG4gKiBAcHJpdmF0ZVxuICogQHR5cGVkZWYge09iamVjdH0gT3B0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGJhc2VVcmw9aHR0cHM6Ly9hc2ttZXRpc2EuY29tLyBCYXNlIFVSTCBvZiBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcm9kdWN0RW5kcG9pbnQ9L2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb24gUGF0aCBvZiBBUEkgZW5kcG9pbnQgZm9yIGNyZWF0aW5nIG9yIHVwZGF0aW5nIHByb2R1Y3RzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gb3JkZXJFbmRwb2ludD0vYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uIFBhdGggb2YgQVBJIGVuZHBvaW50IGZvciBjcmVhdGluZyBvciB1cGRhdGluZyBvcmRlcnNcbiAqL1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQmFzZSBjbGFzcyBmb3IgYW55IGVudmlyb25tZW50LlxuXG4gKi9cbmNsYXNzIE1ldGlzYSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBNZXRpc2FgIHdpdGggYG9wdHNgLlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhIGNvbnRydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKFxuICAgIHtcbiAgICAgICAgYmFzZVVybDogJ2h0dHBzOi8vYXNrbWV0aXNhLmNvbS8nLFxuICAgICAgICBwcm9kdWN0RW5kcG9pbnQ6IFwiL2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb25cIixcbiAgICAgICAgb3JkZXJFbmRwb2ludDogXCIvYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uXCIsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5vcHRzKX0hYCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgcmVhZHkgdG8gc3RhcnQgY2FsbGluZyBBUEkuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGlzUmVhZHlUb1N0YXJ0KCkge1xuICAgIHZhciBpc1JlYWR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWAuXG4gICAqL1xuICByZWdpc3Rlck9wdGlvbnMoKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2Jhc2VVcmwnKSB7XG4gICAgICAvLyBJbml0IEJhc2UgVVJMIGZvciB0ZXN0aW5nXG4gICAgICB0aGlzLmxvZygnQmFzZSBVUkwgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5vcHRzLmJhc2VVcmwgPSBhcmd1bWVudHNbMV07IC8vIG92ZXJyaWRlXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdwcm9kdWN0Jykge1xuICAgICAgLy8gSW5pdCBQcm9kdWN0IG9iamVjdFxuICAgICAgdGhpcy5sb2coJ1Byb2R1Y3QgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5wcm9kdWN0ID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnb3JkZXInKSB7XG4gICAgICAvLyBJbml0IE9yZGVyIG9iamVjdFxuICAgICAgdGhpcy5sb2coJ09yZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMub3JkZXIgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdzdG9yZScpIHtcbiAgICAgIC8vIEluaXQgc3RvcmUgc2x1Z1xuICAgICAgdGhpcy5sb2coJ1N0b3JlIHNsdWcgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5zbHVnID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY3VzdG9tZXInKSB7XG4gICAgICAvLyBJbml0IHVzZXIgYmFzZWQgcmVjb21tZW5kYXRpb25zXG4gICAgICB0aGlzLmxvZygnQ3VzdG9tZXJfaWQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jdXN0b21lcklkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY2F0ZWdvcnknKSB7XG4gICAgICAvLyBJbml0IGNhdGVnb3J5XG4gICAgICB0aGlzLmxvZygnQ2F0ZWdvcnkgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jYXRlZ29yeU5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdicmFuZCcpIHtcbiAgICAgIC8vIEluaXQgYnJhbmRcbiAgICAgIHRoaXMubG9nKCdCcmFuZCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmJyYW5kbmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Byb2R1Y3RJZCcpIHtcbiAgICAgIC8vIEluaXQgcHJvZHVjdCBpZFxuICAgICAgdGhpcy5sb2coJ1Byb2R1Y3QgSUQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5wcm9kdWN0SWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdnZW5kZXInKSB7XG4gICAgICAvLyBJbml0IGdlbmRlclxuICAgICAgdGhpcy5sb2coJ0dlbmRlciBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmdlbmRlciA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Nlc3Npb24nKSB7XG4gICAgICAvLyBJbml0IHNlc3Npb25cbiAgICAgIHRoaXMubG9nKCdTZXNzaW9uIGlzJywgYXJndW1lbnRzWzFdKVxuICAgICAgdGhpcy5zZXNzaW9uSWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMubG9nKCdMYW5ndWFnZSBpcycsIGFyZ3VtZW50c1sxXSlcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNZXRpc2E7XG4iLCJ2YXIgTWV0aXNhQ29yZSA9IHJlcXVpcmUoJy4uL2NvcmUnKTtcbnZhciB3aXRoSUZyYW1lID0gcmVxdWlyZSgnLi93aXRoSUZyYW1lJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcbnZhciBjb21wb3NlID0gdXRpbC5jb21wb3NlO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2Mge0BsaW5rIE1ldGlzYX0gY2xhc3MgdGhhdCBjb21wb3NlcyB3aXRoIHtAbGluayBjb21wb3NlQ2xhc3MuSUZyYW1lfVxuICogQHJlcXVpcmVzIE1ldGlzYVxuICogQHJlcXVpcmVzIGNvbXBvc2VDbGFzc1xuICogQHJlcXVpcmVzIGdldFV0aWwuY29tcG9zZVxuICovXG52YXIgTWV0aXNhd2l0aElGcmFtZSA9IGNvbXBvc2UoTWV0aXNhQ29yZSkod2l0aElGcmFtZSk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciBicm93c2VyIGVudmlyb25tZW50LiBUaGlzIGlzIGluaXRpYWxpc2VkIGFuZCBleHBvc2VkIHRvIGB3aW5kb3cuTWV0aXNhYCB3aGVuIHlvdSBpbXBvcnQgdGhyb3VnaCBvdXIgW2V4YW1wbGVdKC8jaW5zdGFsbGF0aW9uKS5cbiAqIEBleHRlbmRzIE1ldGlzYXdpdGhJRnJhbWVcbiAqL1xuY2xhc3MgTWV0aXNhRG9tIGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBNZXRpc2FEb21gIHdpdGggYG9wdHNgLlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhRG9tIGNvbnRydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBpZiAoJCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdNZXRpc2EgRG9tIHJlcXVpcmVzIGpRdWVyeSB0byBiZSBhdmFpbGFibGUhJylcbiAgICB9XG4gICAgc3VwZXIob3B0cyk7XG5cbiAgICBjb25zb2xlLmxvZyhgaW5pdGlhbGlzZWQgTWV0aXNhIERvbSB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5vcHRzKX0hYCk7XG4gICAgdGhpcy5yZW5kZXJXaWRnZXQgPSB0aGlzLnJlbmRlcldpZGdldC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJPcHRpb25zID0gdGhpcy5yZWdpc3Rlck9wdGlvbnMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuYXR0YWNoUmVnaXN0ZXJPcHRpb25zVG9XaW5kb3coKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyByZWdpc3RlcmVkIG9wdGlvbnMgdG8gYHdpbmRvdy5tdGAuXG4gICAqL1xuICBhdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpIHtcbiAgICB3aW5kb3cubXQgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgb3B0aW9ucyBmcm9tIGBtdCgne3sgb3B0aW9uIH19Jywge3sgdmFsdWUgfX0pYGFuZCBkZXRlcm1pbmVzIHdoZXRoZXIgcHJvZHVjdCBvciBvcmRlciBkYXRhIHNob3VsZCBiZSBoYW5kbGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xuICAgIHN1cGVyLnJlZ2lzdGVyT3B0aW9ucy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNSZWFkeVRvU3RhcnQpIHtcbiAgICAgIHRoaXMucmVuZGVyV2lkZ2V0KCk7XG4gICAgICBpZiAodGhpcy5wcm9kdWN0KSB7XG4gICAgICAgIHRoaXMudHJhY2soJ3Byb2R1Y3QnLCB0aGlzLnByb2R1Y3QpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLm9yZGVyKSB7XG4gICAgICAgIHRoaXMudHJhY2soJ29yZGVyJywgdGhpcy5vcmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgTWV0aXNhIHdpZGdldHMgaW4gdGhlIGJyb3dzZXIuXG4gICAqL1xuICByZW5kZXJXaWRnZXQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgd2lkZ2V0cyA9ICQoJy5tdC13aWRnZXQnKTtcblxuICAgIC8vIENvbnZlcnQgd2lkZ2V0cyBub2RlbGlzdCB0byB0cnVlIGFycmF5XG4gICAgd2lkZ2V0cyA9ICQubWFrZUFycmF5KHdpZGdldHMpO1xuXG4gICAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHdpZGdldCkge1xuICAgICAgLy8gUmVuZGVyIHdpZGdldCB1c2luZyBBamF4IHNvIHdlIGNhbiBncmFjZWZ1bGx5IGRlZ3JhZGUgaWYgdGhlcmUgaXMgbm8gY29udGVudCBhdmFpbGFibGVcbiAgICAgIHZhciB3aWRnZXRJZCA9IHdpZGdldC5kYXRhc2V0LndpZGdldElkLFxuICAgICAgICBjdXN0b21lcklkID0gd2lkZ2V0LmRhdGFzZXQuY3VzdG9tZXJJZCxcbiAgICAgICAgcHJvZHVjdElkID0gd2lkZ2V0LmRhdGFzZXQucHJvZHVjdElkLFxuICAgICAgICBjYXRlZ29yeU5hbWUgPSB3aWRnZXQuZGF0YXNldC5jYXRlZ29yeU5hbWUsXG4gICAgICAgIGJyYW5kbmFtZSA9IHdpZGdldC5kYXRhc2V0LmJyYW5kbmFtZSxcbiAgICAgICAgc2Vzc2lvbklkID0gd2lkZ2V0LmRhdGFzZXQuc2Vzc2lvbklkLFxuICAgICAgICBsYW5ndWFnZSA9IHdpZGdldC5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArICcvYXBpL3YxL3dpZGdldC1jdXN0b21lcj93aWRnZXRfaWQ9JyArIHdpZGdldElkO1xuXG4gICAgICAvLyBPdmVycmlkZSBjdXN0b21lciwgY2F0ZWdvcnkgb3IgYnJhbmRcbiAgICAgIGlmIChjdXN0b21lcklkKSB0aGlzLmN1c3RvbWVySWQgPSBjdXN0b21lcklkO1xuICAgICAgaWYgKHByb2R1Y3RJZCkgdGhpcy5wcm9kdWN0SWQgPSBwcm9kdWN0SWQ7XG4gICAgICBpZiAoY2F0ZWdvcnlOYW1lKSB0aGlzLmNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5TmFtZTtcbiAgICAgIGlmIChicmFuZG5hbWUpIHRoaXMuYnJhbmRuYW1lID0gYnJhbmRuYW1lO1xuICAgICAgaWYgKHNlc3Npb25JZCkgdGhpcy5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gICAgICBpZiAobGFuZ3VhZ2UpIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcblxuICAgICAgaWYgKHRoaXMuY3VzdG9tZXJJZCkge1xuICAgICAgICB1cmwgKz0gJyZjdXN0b21lcl9pZD0nICsgZXNjYXBlKHRoaXMuY3VzdG9tZXJJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnByb2R1Y3RJZCkge1xuICAgICAgICB1cmwgKz0gJyZwcm9kdWN0X2lkPScgKyBlc2NhcGUodGhpcy5wcm9kdWN0SWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jYXRlZ29yeU5hbWUpIHtcbiAgICAgICAgdXJsICs9ICcmY2F0ZWdvcnlfbmFtZT0nICsgZXNjYXBlKHRoaXMuY2F0ZWdvcnlOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYnJhbmRuYW1lKSB7XG4gICAgICAgIHVybCArPSAnJmJyYW5kbmFtZT0nICsgZXNjYXBlKHRoaXMuYnJhbmRuYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZ2VuZGVyKSB7XG4gICAgICAgIHVybCArPSAnJmdlbmRlcj0nICsgZXNjYXBlKHRoaXMuZ2VuZGVyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2Vzc2lvbklkKSB7XG4gICAgICAgIHVybCArPSAnJnNlc3Npb25faWQ9JyArIGVzY2FwZSh0aGlzLnNlc3Npb25JZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmxhbmd1YWdlKSB7XG4gICAgICAgIHVybCArPSAnJmxhbmd1YWdlPScgKyBlc2NhcGUodGhpcy5sYW5ndWFnZSk7XG4gICAgICB9XG5cbiAgICAgIHVybCArPSAnJmZvcm1hdD1odG1sJztcbiAgICAgIC8vIFByZXBhcmUgaWZyYW1lXG4gICAgICB2YXIgaWZyYW1lID0gc2VsZi5jcmVhdGVJRnJhbWVXaXRoSWQod2lkZ2V0SWQpO1xuXG4gICAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgICAgLy8gUmVuZGVyIGxvYWRlclxuICAgICAgdmFyIGh0bWwgPSBzZWxmLmdldExvYWRlckhUTUwoKTtcblxuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQub3BlbigpO1xuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoaHRtbCk7XG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgIH0pXG4gICAgICAuZG9uZShmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgLy8gRGVsZXRlIGxvYWRlciBpZnJhbWVcbiAgICAgICAgdmFyIG9sZElGcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aWRnZXQtJyArXG4gICAgICAgIHdpZGdldElkKTtcblxuICAgICAgICB2YXIgaWZyYW1lUGFyZW50ID0gb2xkSUZyYW1lLnBhcmVudE5vZGU7XG5cbiAgICAgICAgaWYgKGlmcmFtZVBhcmVudCkge1xuICAgICAgICAgIHdoaWxlIChpZnJhbWVQYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgaWZyYW1lUGFyZW50LnJlbW92ZUNoaWxkKGlmcmFtZVBhcmVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgaWZyYW1lIGZvciB3aWRnZXRcbiAgICAgICAgdmFyIGlmcmFtZSA9IHNlbGYuY3JlYXRlSUZyYW1lV2l0aElkKHdpZGdldElkKTtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHdpZGdldC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgICAgICAgdmFyIGh0bWwgPSBzZWxmLmRlY29kZUh0bWxFbnRpdGllcyhkYXRhKTtcblxuICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShodG1sKTtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmNsb3NlKCk7XG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMzBweCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEh0bWwgd2lsbCBiZSBlbXB0eSBpZiBzdG9yZSBoYXMgcnVuIG91dCBvZiBmcmVlIHNhbGVzIGNyZWRpdHMuXG4gICAgICAgICAgICAvLyBHcmFjZWZ1bGx5IGZhaWwgdG8gbG9hZCB3aWRnZXQgYnkgcmVtb3ZpbmcgdGhlIGlmcmFtZSBmcm9tIERPTS5cbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIHN0YXR1c1RleHQpO1xuICAgICAgICAgIC8vIFJlbW92ZSBpZnJhbWUgZnJvbSBET01cbiAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG4gIC8qKlxuICAgKiBTdGFydHMgdHJhY2tpbmcgYnkgc3VibWl0dGluZyBwcm9kdWN0IG9yIG9yZGVyIGRhdGEgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhdCBDYXRlZ29yeSBuYW1lIG9mIGRhdGEgKGFsbG93ZWQgdmFsdWVzOiBgXCJwcm9kdWN0XCJgLGBcIm9yZGVyXCJgKVxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBPYmplY3Qgb2YgcHJvZHVjdCBvciBvcmRlciBkYXRhXG4gICAqL1xuXG4gIHRyYWNrKGNhdCwgZGF0YSkge1xuICAgIGlmICh0aGlzLnNsdWcpIHtcbiAgICAgIGlmIChjYXQgPT09ICdwcm9kdWN0Jykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlUHJvZHVjdChkYXRhKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNhdCA9PT0gJ29yZGVyJykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlT3JkZXIoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcm9kdWN0IGlmIGl0IGRvZXMgbm90IGV4aXN0IGluIE1ldGlzYSBvciB1cGRhdGVzIHRoZSBwcm9kdWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvZHVjdERhdGEgW3Byb2R1Y3REYXRhXXtAbGluayBCUk9XU0VSL1NDSEVNQS5odG1sI3Byb2R1Y3QtZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgcHJvZHVjdCBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlUHJvZHVjdChkYXRhKSB7XG4gICAgdmFyIHVybCA9IHRoaXMub3B0cy5iYXNlVXJsICsgdGhpcy5zbHVnICsgdGhpcy5vcHRzLnByb2R1Y3RFbmRwb2ludDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbnAnLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICB9LFxuICAgICAgc3RhdHVzQ29kZToge1xuICAgICAgICAgIDUwMDogZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnK3hocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvcmRlciBpZiBpdCBkb2VzIG5vdCBleGlzdCBpbiBNZXRpc2Egb3IgdXBkYXRlcyB0aGUgb3JkZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmRlckRhdGEgW29yZGVyRGF0YV17QGxpbmsgQlJPV1NFUi9TQ0hFTUEuaHRtbCNvcmRlci1kYXRhfSBvYmplY3QgdG8gYmUgc3VibWl0dGVkIHRvIHRoZSBvcmRlciBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlT3JkZXIoZGF0YSkge1xuICAgIHZhciB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArIHRoaXMub3B0cy5vcmRlckVuZHBvaW50O1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxuICAgICAgZGF0YVR5cGU6ICdqc29ucCcsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIH0sXG4gICAgICBzdGF0dXNDb2RlOiB7XG4gICAgICAgICAgNTAwOiBmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ludGVybmFsIHNlcnZlciBlcnJvcicpO1xuICAgICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzJyk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcreGhyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgbG9ncyB0byBicm93c2VyIGNvbnNvbGUgd2hlbiBgZGVidWdgIHByb3BlcnR5IG9mIGBNZXRpc2FEb21gIG9iamVjdCBpcyBgdHJ1ZWBcbiAgICovXG4gIGxvZygpIHtcbiAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2cuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYURvbTtcbiIsIi8qKlxuICogUmV0dXJucyB7QGxpbmsgY29tcG9zZUNsYXNzLklGcmFtZX0gY29tcG9zZWQgd2l0aCBgY29tcG9zZWRDbGFzc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSAge2NsYXNzfSBgY29tcG9zZWRDbGFzc2AgdG8gYmUgY29tcG9zZWQuXG4gKiBAcmV0dXJucyB7Y29tcG9zZWRDbGFzcy5JRnJhbWV9XG4gKi9cblxudmFyIGNvbXBvc2VDbGFzcyA9IGZ1bmN0aW9uKGNvbXBvc2VkQ2xhc3MpIHtcbiAgLyoqXG4gICAqIGA8aWZyYW1lPmAgZWxlbWVudCBpbiB0aGUgcmVjb21tZW5kYXRpb24gd2lkZ2V0LlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBJRnJhbWVcbiAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzc1xuICAgKi9cbiAgcmV0dXJuIGNsYXNzIElGcmFtZSBleHRlbmRzIGNvbXBvc2VkQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYGlmcmFtZWAgZWxlbWVudFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFJlY29tbWVuZGF0aW9uIHdpZGdldCBJRFxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBjcmVhdGVJRnJhbWVXaXRoSWQoaWQpIHtcbiAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnYm9yZGVyOiAwcHg7IHdpZHRoOiAxMDAlOycpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc2Nyb2xsaW5nJywgJ25vJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdvbmxvYWQnLCAnd2luZG93Lk1ldGlzYS5yZXNpemVJZnJhbWUodGhpcyknKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpZGdldC0nICsgaWQpO1xuXG4gICAgICByZXR1cm4gaWZyYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2l6ZXMgYGlmcmFtZWAgZWxlbWVudFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIGBpZnJhbWVgIGVsZW1lbnQgdG8gYmUgcmVzaXplZC5cbiAgICAgKi9cbiAgICByZXNpemVJZnJhbWUob2JqKSB7XG4gICAgICBvYmouc3R5bGUuaGVpZ2h0ID0gMDtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSBvYmouY29udGVudFdpbmRvdy5kb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodCArICdweCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBsb2FkZXIgSFRNTFxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRMb2FkZXJIVE1MKCkge1xuICAgICAgcmV0dXJuICc8IWRvY3R5cGUgaHRtbD48aHRtbD48c3R5bGU+Ym9keXtoZWlnaHQ6IDEwMHB4O30uY3MtbG9hZGVye2hlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7fS5jcy1sb2FkZXItaW5uZXJ7dHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpOyB0b3A6IDUwJTsgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDogY2FsYygxMDAlIC0gMjAwcHgpOyBjb2xvcjogI0EyQTNBMzsgcGFkZGluZzogMCAxMDBweDsgdGV4dC1hbGlnbjogY2VudGVyO30uY3MtbG9hZGVyLWlubmVyIGxhYmVse2ZvbnQtc2l6ZTogMjBweDsgb3BhY2l0eTogMDsgZGlzcGxheTogaW5saW5lLWJsb2NrO31Aa2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTt9MzMle29wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO302NiV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTt9fUAtd2Via2l0LWtleWZyYW1lcyBsb2x7MCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTt9MzMle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO30xMDAle29wYWNpdHk6IDA7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTt9fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDYpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg1KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAxMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNCl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMjAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDMpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDMwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgyKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA0MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMSl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgNTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fTwvc3R5bGU+PGJvZHk+IDxkaXYgY2xhc3M9XCJjcy1sb2FkZXJcIj4gPGRpdiBjbGFzcz1cImNzLWxvYWRlci1pbm5lclwiPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8L2Rpdj48L2Rpdj48L2JvZHk+PC9odG1sPic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkZWNvZGVkIEhUTUwgZW50aXRpZXNcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgSFRNTCBlbnRpdGllc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZGVjb2RlSHRtbEVudGl0aWVzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIz8oXFx3Kyk7L2csIGZ1bmN0aW9uKG1hdGNoLCBkZWMpIHtcbiAgICAgICAgaWYgKGlzTmFOKGRlYykpIHtcbiAgICAgICAgICB2YXIgY2hhcnMgPSB7XG4gICAgICAgICAgICBxdW90OiAzNCxcbiAgICAgICAgICAgIGFtcDogMzgsXG4gICAgICAgICAgICBsdDogNjAsXG4gICAgICAgICAgICBndDogNjIsXG4gICAgICAgICAgICBuYnNwOiAxNjAsXG4gICAgICAgICAgICBjb3B5OiAxNjksXG4gICAgICAgICAgICByZWc6IDE3NCxcbiAgICAgICAgICAgIGRlZzogMTc2LFxuICAgICAgICAgICAgZnJhc2w6IDQ3LFxuICAgICAgICAgICAgdHJhZGU6IDg0ODIsXG4gICAgICAgICAgICBldXJvOiA4MzY0LFxuICAgICAgICAgICAgQWdyYXZlOiAxOTIsXG4gICAgICAgICAgICBBYWN1dGU6IDE5MyxcbiAgICAgICAgICAgIEFjaXJjOiAxOTQsXG4gICAgICAgICAgICBBdGlsZGU6IDE5NSxcbiAgICAgICAgICAgIEF1bWw6IDE5NixcbiAgICAgICAgICAgIEFyaW5nOiAxOTcsXG4gICAgICAgICAgICBBRWxpZzogMTk4LFxuICAgICAgICAgICAgQ2NlZGlsOiAxOTksXG4gICAgICAgICAgICBFZ3JhdmU6IDIwMCxcbiAgICAgICAgICAgIEVhY3V0ZTogMjAxLFxuICAgICAgICAgICAgRWNpcmM6IDIwMixcbiAgICAgICAgICAgIEV1bWw6IDIwMyxcbiAgICAgICAgICAgIElncmF2ZTogMjA0LFxuICAgICAgICAgICAgSWFjdXRlOiAyMDUsXG4gICAgICAgICAgICBJY2lyYzogMjA2LFxuICAgICAgICAgICAgSXVtbDogMjA3LFxuICAgICAgICAgICAgRVRIOiAyMDgsXG4gICAgICAgICAgICBOdGlsZGU6IDIwOSxcbiAgICAgICAgICAgIE9ncmF2ZTogMjEwLFxuICAgICAgICAgICAgT2FjdXRlOiAyMTEsXG4gICAgICAgICAgICBPY2lyYzogMjEyLFxuICAgICAgICAgICAgT3RpbGRlOiAyMTMsXG4gICAgICAgICAgICBPdW1sOiAyMTQsXG4gICAgICAgICAgICB0aW1lczogMjE1LFxuICAgICAgICAgICAgT3NsYXNoOiAyMTYsXG4gICAgICAgICAgICBVZ3JhdmU6IDIxNyxcbiAgICAgICAgICAgIFVhY3V0ZTogMjE4LFxuICAgICAgICAgICAgVWNpcmM6IDIxOSxcbiAgICAgICAgICAgIFV1bWw6IDIyMCxcbiAgICAgICAgICAgIFlhY3V0ZTogMjIxLFxuICAgICAgICAgICAgVEhPUk46IDIyMixcbiAgICAgICAgICAgIHN6bGlnOiAyMjMsXG4gICAgICAgICAgICBhZ3JhdmU6IDIyNCxcbiAgICAgICAgICAgIGFhY3V0ZTogMjI1LFxuICAgICAgICAgICAgYWNpcmM6IDIyNixcbiAgICAgICAgICAgIGF0aWxkZTogMjI3LFxuICAgICAgICAgICAgYXVtbDogMjI4LFxuICAgICAgICAgICAgYXJpbmc6IDIyOSxcbiAgICAgICAgICAgIGFlbGlnOiAyMzAsXG4gICAgICAgICAgICBjY2VkaWw6IDIzMSxcbiAgICAgICAgICAgIGVncmF2ZTogMjMyLFxuICAgICAgICAgICAgZWFjdXRlOiAyMzMsXG4gICAgICAgICAgICBlY2lyYzogMjM0LFxuICAgICAgICAgICAgZXVtbDogMjM1LFxuICAgICAgICAgICAgaWdyYXZlOiAyMzYsXG4gICAgICAgICAgICBpYWN1dGU6IDIzNyxcbiAgICAgICAgICAgIGljaXJjOiAyMzgsXG4gICAgICAgICAgICBpdW1sOiAyMzksXG4gICAgICAgICAgICBldGg6IDI0MCxcbiAgICAgICAgICAgIG50aWxkZTogMjQxLFxuICAgICAgICAgICAgb2dyYXZlOiAyNDIsXG4gICAgICAgICAgICBvYWN1dGU6IDI0MyxcbiAgICAgICAgICAgIG9jaXJjOiAyNDQsXG4gICAgICAgICAgICBvdGlsZGU6IDI0NSxcbiAgICAgICAgICAgIG91bWw6IDI0NixcbiAgICAgICAgICAgIGRpdmlkZTogMjQ3LFxuICAgICAgICAgICAgb3NsYXNoOiAyNDgsXG4gICAgICAgICAgICB1Z3JhdmU6IDI0OSxcbiAgICAgICAgICAgIHVhY3V0ZTogMjUwLFxuICAgICAgICAgICAgdWNpcmM6IDI1MSxcbiAgICAgICAgICAgIHV1bWw6IDI1MixcbiAgICAgICAgICAgIHlhY3V0ZTogMjUzLFxuICAgICAgICAgICAgdGhvcm46IDI1NCxcbiAgICAgICAgICAgIHl1bWw6IDI1NSxcbiAgICAgICAgICAgIGxzcXVvOiA4MjE2LFxuICAgICAgICAgICAgcnNxdW86IDgyMTcsXG4gICAgICAgICAgICBzYnF1bzogODIxOCxcbiAgICAgICAgICAgIGxkcXVvOiA4MjIwLFxuICAgICAgICAgICAgcmRxdW86IDgyMjEsXG4gICAgICAgICAgICBiZHF1bzogODIyMixcbiAgICAgICAgICAgIGRhZ2dlcjogODIyNCxcbiAgICAgICAgICAgIERhZ2dlcjogODIyNSxcbiAgICAgICAgICAgIHBlcm1pbDogODI0MCxcbiAgICAgICAgICAgIGxzYXF1bzogODI0OSxcbiAgICAgICAgICAgIHJzYXF1bzogODI1MCxcbiAgICAgICAgICAgIHNwYWRlczogOTgyNCxcbiAgICAgICAgICAgIGNsdWJzOiA5ODI3LFxuICAgICAgICAgICAgaGVhcnRzOiA5ODI5LFxuICAgICAgICAgICAgZGlhbXM6IDk4MzAsXG4gICAgICAgICAgICBvbGluZTogODI1NCxcbiAgICAgICAgICAgIGxhcnI6IDg1OTIsXG4gICAgICAgICAgICB1YXJyOiA4NTkzLFxuICAgICAgICAgICAgcmFycjogODU5NCxcbiAgICAgICAgICAgIGRhcnI6IDg1OTUsXG4gICAgICAgICAgICBoZWxsaXA6IDEzMyxcbiAgICAgICAgICAgIG5kYXNoOiAxNTAsXG4gICAgICAgICAgICBtZGFzaDogMTUxLFxuICAgICAgICAgICAgaWV4Y2w6IDE2MSxcbiAgICAgICAgICAgIGNlbnQ6IDE2MixcbiAgICAgICAgICAgIHBvdW5kOiAxNjMsXG4gICAgICAgICAgICBjdXJyZW46IDE2NCxcbiAgICAgICAgICAgIHllbjogMTY1LFxuICAgICAgICAgICAgYnJ2YmFyOiAxNjYsXG4gICAgICAgICAgICBicmtiYXI6IDE2NixcbiAgICAgICAgICAgIHNlY3Q6IDE2NyxcbiAgICAgICAgICAgIHVtbDogMTY4LFxuICAgICAgICAgICAgZGllOiAxNjgsXG4gICAgICAgICAgICBvcmRmOiAxNzAsXG4gICAgICAgICAgICBsYXF1bzogMTcxLFxuICAgICAgICAgICAgbm90OiAxNzIsXG4gICAgICAgICAgICBzaHk6IDE3MyxcbiAgICAgICAgICAgIG1hY3I6IDE3NSxcbiAgICAgICAgICAgIGhpYmFyOiAxNzUsXG4gICAgICAgICAgICBwbHVzbW46IDE3NyxcbiAgICAgICAgICAgIHN1cDI6IDE3OCxcbiAgICAgICAgICAgIHN1cDM6IDE3OSxcbiAgICAgICAgICAgIGFjdXRlOiAxODAsXG4gICAgICAgICAgICBtaWNybzogMTgxLFxuICAgICAgICAgICAgcGFyYTogMTgyLFxuICAgICAgICAgICAgbWlkZG90OiAxODMsXG4gICAgICAgICAgICBjZWRpbDogMTg0LFxuICAgICAgICAgICAgc3VwMTogMTg1LFxuICAgICAgICAgICAgb3JkbTogMTg2LFxuICAgICAgICAgICAgcmFxdW86IDE4NyxcbiAgICAgICAgICAgIGZyYWMxNDogMTg4LFxuICAgICAgICAgICAgZnJhYzEyOiAxODksXG4gICAgICAgICAgICBmcmFjMzQ6IDE5MCxcbiAgICAgICAgICAgIGlxdWVzdDogMTkxLFxuICAgICAgICAgICAgQWxwaGE6IDkxMyxcbiAgICAgICAgICAgIGFscGhhOiA5NDUsXG4gICAgICAgICAgICBCZXRhOiA5MTQsXG4gICAgICAgICAgICBiZXRhOiA5NDYsXG4gICAgICAgICAgICBHYW1tYTogOTE1LFxuICAgICAgICAgICAgZ2FtbWE6IDk0NyxcbiAgICAgICAgICAgIERlbHRhOiA5MTYsXG4gICAgICAgICAgICBkZWx0YTogOTQ4LFxuICAgICAgICAgICAgRXBzaWxvbjogOTE3LFxuICAgICAgICAgICAgZXBzaWxvbjogOTQ5LFxuICAgICAgICAgICAgWmV0YTogOTE4LFxuICAgICAgICAgICAgemV0YTogOTUwLFxuICAgICAgICAgICAgRXRhOiA5MTksXG4gICAgICAgICAgICBldGE6IDk1MSxcbiAgICAgICAgICAgIFRoZXRhOiA5MjAsXG4gICAgICAgICAgICB0aGV0YTogOTUyLFxuICAgICAgICAgICAgSW90YTogOTIxLFxuICAgICAgICAgICAgaW90YTogOTUzLFxuICAgICAgICAgICAgS2FwcGE6IDkyMixcbiAgICAgICAgICAgIGthcHBhOiA5NTQsXG4gICAgICAgICAgICBMYW1iZGE6IDkyMyxcbiAgICAgICAgICAgIGxhbWJkYTogOTU1LFxuICAgICAgICAgICAgTXU6IDkyNCxcbiAgICAgICAgICAgIG11OiA5NTYsXG4gICAgICAgICAgICBOdTogOTI1LFxuICAgICAgICAgICAgbnU6IDk1NyxcbiAgICAgICAgICAgIFhpOiA5MjYsXG4gICAgICAgICAgICB4aTogOTU4LFxuICAgICAgICAgICAgT21pY3JvbjogOTI3LFxuICAgICAgICAgICAgb21pY3JvbjogOTU5LFxuICAgICAgICAgICAgUGk6IDkyOCxcbiAgICAgICAgICAgIHBpOiA5NjAsXG4gICAgICAgICAgICBSaG86IDkyOSxcbiAgICAgICAgICAgIHJobzogOTYxLFxuICAgICAgICAgICAgU2lnbWE6IDkzMSxcbiAgICAgICAgICAgIHNpZ21hOiA5NjMsXG4gICAgICAgICAgICBUYXU6IDkzMixcbiAgICAgICAgICAgIHRhdTogOTY0LFxuICAgICAgICAgICAgVXBzaWxvbjogOTMzLFxuICAgICAgICAgICAgdXBzaWxvbjogOTY1LFxuICAgICAgICAgICAgUGhpOiA5MzQsXG4gICAgICAgICAgICBwaGk6IDk2NixcbiAgICAgICAgICAgIENoaTogOTM1LFxuICAgICAgICAgICAgY2hpOiA5NjcsXG4gICAgICAgICAgICBQc2k6IDkzNixcbiAgICAgICAgICAgIHBzaTogOTY4LFxuICAgICAgICAgICAgT21lZ2E6IDkzNyxcbiAgICAgICAgICAgIG9tZWdhOiA5NjlcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGNoYXJzW2RlY10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVjID0gY2hhcnNbZGVjXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZGVjKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZUNsYXNzO1xuIiwiY29uc3QgTWV0aXNhRG9tID0gcmVxdWlyZSgnLi9NZXRpc2EvZG9tJyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cblxuLyoqXG4gKiBMb2FkcyBqUXVlcnkgYW5kIHtAbGluayBNZXRpc2FEb219IG9iamVjdCBpbnRvIHdpbmRvdyBvYmplY3QgaW4gYnJvd3NlclxuICogQHByaXZhdGVcbiAqIEByZXF1aXJlcyBNZXRpc2FEb21cbiAqIEByZXF1aXJlcyBnZXRVdGlsXG4gKi9cbmZ1bmN0aW9uIGJyb3dzZXIoKSB7XG4gIGlmICh1dGlsLmVudmlyb25tZW50ICE9PSAnYnJvd3NlcicgKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIGJyb3dzZXIgY2FuIG9ubHkgcnVuIGluc2lkZSBhIGJyb3dzZXInKTtcbiAgfVxuICB3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSAkIHx8IGpRdWVyeSB8fCB7fTtcblxuICB3aW5kb3cuTWV0aXNhID0gbmV3IE1ldGlzYURvbSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChicm93c2VyKSgpO1xuIiwiLyoqXG4gKiBHZXRzIFNESyB1dGlsaXRpZXNcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge1V0aWxPYmp9XG4gKi9cbmZ1bmN0aW9uIGdldFV0aWwoKSB7XG4gIC8qKlxuICAgKiBPYmplY3QgY29udGFpbmluZyB1dGlsaWxpdGllc1xuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBVdGlsT2JqXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbnZpcm9ubWVudCBFbnZpcm9ubWVudCB0aGF0IE1ldGlzYSBvYmplY3QgaXMgZXhwb3NlZCB0by4gUmV0dXJucyBgJ2Jyb3dzZXInYCBvciBgbm9kZWAuXG4gICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGNvbXBvc2UgW0Z1bmN0aW9uXSgjZ2V0dXRpbGNvbXBvc2VmdW5jb3JpZ2luYWwt4oeSLWNsYXNzKSBmb3IgY29tcG9zaW5nIGNsYXNzZXNcbiAgICogQG1lbWJlcm9mIGdldFV0aWxcbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29tcG9zZWQgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSAge2NsYXNzfSBvcmlnaW5hbCBDbGFzcyB0byBiZSBjb21wb3NlZCB0by5cbiAgICogQHJldHVybiB7Y2xhc3N9XG4gICAqL1xuICB2YXIgY29tcG9zZUZ1bmMgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0aW9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgY29tcG9zZWQgPSBvcmlnaW5hbDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbXBvc2VkID0gY29tcG9zaXRpb25zW2ldKGNvbXBvc2VkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21wb3NlZDtcbiAgICB9XG4gIH07XG4gIHJldHVybiB7XG4gICAgZW52aXJvbm1lbnQ6IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gJ2Jyb3dzZXInIDogJ25vZGUnLFxuICAgIGNvbXBvc2U6IGNvbXBvc2VGdW5jLFxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSAoZ2V0VXRpbCkoKTtcbiJdfQ==
