(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Metisa {
  constructor(opts) {
    opts = opts || {};
    this.opts = Object.assign(
      {
        baseUrl: 'https://askmetisa.com/',
        productEndpoint: "metisa/api/v1/product-collection",
        orderEndpoint: "metisa/api/v1/order-transaction",
      },
      opts
    );
    this.debug = true;
    console.log(`initialised Metisa with ${JSON.stringify(this.opts)}!`);
  }

  isReadyToStart() {
    var isReady = false;
    return true;
  }

  registerOptions() {
    if (arguments[0] === 'token') {
        // Init API token ID
        this.log('API token ID is', arguments[1]);
        this.tokenId = arguments[1];
        // Init Product object
    } else if (arguments[0] === 'product') {
        this.log('Product is', arguments[1]);
        this.product = arguments[1];
        // Init Order object
    } else if (arguments[0] === 'order') {
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
  * Base class for browser environment.
  *
  * This is initialised and exposed to `window.Metisa` when you import through our [example](/#installation).
  *
  * @class
  */
class MetisaDom extends compose(MetisaCore)(withIFrame) {
  /**
   * constructor - create MetisaDom
   *
   * @param  {object} opts options object to be passed to MetisaCore contructor
   * @param  {string} opts.store name of your store

   * @return {class}  MetisaDom
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

  attachRegisterOptionsToWindow() {
      window.mt = this.registerOptions;
  }

  registerOptions() {
    super.registerOptions.apply(this, arguments);

    if (this.isReadyToStart) {
      this.renderWidget();
      this.customIntegration();
    }
  }

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

  customIntegration() {
    if (this.tokenId) {
      var url, data;
      if (this.product) {
        // Update product
        url = this.opts.baseUrl + this.opts.productEndpoint;
        data = this.product;
      } else if (this.order) {
        // Submit order
        url = this.opts.baseUrl + this.opts.orderEndpoint;
        data = this.order;
      }
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('X-CSRFToken', this.tokenId);
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
  }

  log() {
    if (this.debug) {
      console.log.apply(window, arguments);
    }
  }
}

module.exports = MetisaDom;

},{"../../util":5,"../core":1,"./withIFrame":3}],3:[function(require,module,exports){
module.exports = function(composedClass) {
  return class IFrame extends composedClass {
    createIFrameWithId(id) {
      var iframe = document.createElement('iframe');

      iframe.setAttribute('style', 'border: 0px; width: 100%;');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('onload', 'window.Metisa.resizeIframe(this)');
      iframe.setAttribute('id', 'widget-' + id);

      return iframe;
    }

    resizeIframe(obj) {
      obj.style.height = 0;
      obj.style.height = obj.contentWindow.document.body.offsetHeight + 'px';
    }

    getLoaderHTML() {
      return '<!doctype html><html><style>body{height: 100px;}.cs-loader{height: 100%; width: 100%;}.cs-loader-inner{transform: translateY(-50%); top: 50%; position: absolute; width: calc(100% - 200px); color: #A2A3A3; padding: 0 100px; text-align: center;}.cs-loader-inner label{font-size: 20px; opacity: 0; display: inline-block;}@keyframes lol{0%{opacity: 0; transform: translateX(-300px);}33%{opacity: 1; transform: translateX(0px);}66%{opacity: 1; transform: translateX(0px);}100%{opacity: 0; transform: translateX(300px);}}@-webkit-keyframes lol{0%{opacity: 0; -webkit-transform: translateX(-300px);}33%{opacity: 1; -webkit-transform: translateX(0px);}66%{opacity: 1; -webkit-transform: translateX(0px);}100%{opacity: 0; -webkit-transform: translateX(300px);}}.cs-loader-inner label:nth-child(6){-webkit-animation: lol 3s infinite ease-in-out; animation: lol 3s infinite ease-in-out;}.cs-loader-inner label:nth-child(5){-webkit-animation: lol 3s 100ms infinite ease-in-out; animation: lol 3s 100ms infinite ease-in-out;}.cs-loader-inner label:nth-child(4){-webkit-animation: lol 3s 200ms infinite ease-in-out; animation: lol 3s 200ms infinite ease-in-out;}.cs-loader-inner label:nth-child(3){-webkit-animation: lol 3s 300ms infinite ease-in-out; animation: lol 3s 300ms infinite ease-in-out;}.cs-loader-inner label:nth-child(2){-webkit-animation: lol 3s 400ms infinite ease-in-out; animation: lol 3s 400ms infinite ease-in-out;}.cs-loader-inner label:nth-child(1){-webkit-animation: lol 3s 500ms infinite ease-in-out; animation: lol 3s 500ms infinite ease-in-out;}</style><body> <div class="cs-loader"> <div class="cs-loader-inner"> <label>●</label> <label>●</label> <label>●</label> <label>●</label> <label>●</label> <label>●</label> </div></div></body></html>';
    }

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

},{}],4:[function(require,module,exports){
const MetisaDom = require('./Metisa/dom');
const util = require('./util');

module.exports = (function() {
  if (util.environment !== 'browser' ) {
    return console.warn('Metisa browser can only run inside a browser');
  }
  window.jQuery = window.$ = $ || jQuery || {};

  window.Metisa = new MetisaDom();
})();

},{"./Metisa/dom":2,"./util":5}],5:[function(require,module,exports){
module.exports = (function() {
  return {
    environment: typeof window === 'object' ? 'browser' : 'node',
    compose: function(original) {
      return function() {
        const compositions = Array.prototype.slice.call(arguments);
        var composed = original;
        for (var i = 0; i < compositions.length; i++) {
          composed = compositions[i](composed);
        }
        return composed;
      }
    }
  };
})();

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWV0aXNhL2NvcmUuanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIE1ldGlzYSB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9hc2ttZXRpc2EuY29tLycsXG4gICAgICAgIHByb2R1Y3RFbmRwb2ludDogXCJtZXRpc2EvYXBpL3YxL3Byb2R1Y3QtY29sbGVjdGlvblwiLFxuICAgICAgICBvcmRlckVuZHBvaW50OiBcIm1ldGlzYS9hcGkvdjEvb3JkZXItdHJhbnNhY3Rpb25cIixcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICB0aGlzLmRlYnVnID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhgaW5pdGlhbGlzZWQgTWV0aXNhIHdpdGggJHtKU09OLnN0cmluZ2lmeSh0aGlzLm9wdHMpfSFgKTtcbiAgfVxuXG4gIGlzUmVhZHlUb1N0YXJ0KCkge1xuICAgIHZhciBpc1JlYWR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZWdpc3Rlck9wdGlvbnMoKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Rva2VuJykge1xuICAgICAgICAvLyBJbml0IEFQSSB0b2tlbiBJRFxuICAgICAgICB0aGlzLmxvZygnQVBJIHRva2VuIElEIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgdGhpcy50b2tlbklkID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAvLyBJbml0IFByb2R1Y3Qgb2JqZWN0XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdwcm9kdWN0Jykge1xuICAgICAgICB0aGlzLmxvZygnUHJvZHVjdCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIHRoaXMucHJvZHVjdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgLy8gSW5pdCBPcmRlciBvYmplY3RcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ29yZGVyJykge1xuICAgICAgICB0aGlzLmxvZygnT3JkZXIgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICB0aGlzLm9yZGVyID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnc3RvcmUnKSB7XG4gICAgICAgIC8vIEluaXQgc3RvcmUgc2x1Z1xuICAgICAgICB0aGlzLmxvZygnU3RvcmUgc2x1ZyBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIHRoaXMuc2x1ZyA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2N1c3RvbWVyJykge1xuICAgICAgICAvLyBJbml0IHVzZXIgYmFzZWQgcmVjb21tZW5kYXRpb25zXG4gICAgICAgIHRoaXMubG9nKCdDdXN0b21lcl9pZCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIHRoaXMuY3VzdG9tZXJJZCA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2NhdGVnb3J5Jykge1xuICAgICAgICAvLyBJbml0IGNhdGVnb3J5XG4gICAgICAgIHRoaXMubG9nKCdDYXRlZ29yeSBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnlOYW1lID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnYnJhbmQnKSB7XG4gICAgICAgIC8vIEluaXQgYnJhbmRcbiAgICAgICAgdGhpcy5sb2coJ0JyYW5kIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgdGhpcy5icmFuZG5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdwcm9kdWN0SWQnKSB7XG4gICAgICAgIC8vIEluaXQgcHJvZHVjdCBpZFxuICAgICAgICB0aGlzLmxvZygnUHJvZHVjdCBJRCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIHRoaXMucHJvZHVjdElkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnZ2VuZGVyJykge1xuICAgICAgICAvLyBJbml0IGdlbmRlclxuICAgICAgICB0aGlzLmxvZygnR2VuZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgdGhpcy5nZW5kZXIgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdzZXNzaW9uJykge1xuICAgICAgICAvLyBJbml0IHNlc3Npb25cbiAgICAgICAgdGhpcy5sb2coJ1Nlc3Npb24gaXMnLCBhcmd1bWVudHNbMV0pXG4gICAgICAgIHRoaXMuc2Vzc2lvbklkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnbGFuZ3VhZ2UnKSB7XG4gICAgICAgIHRoaXMubG9nKCdMYW5ndWFnZSBpcycsIGFyZ3VtZW50c1sxXSlcbiAgICAgICAgdGhpcy5sYW5ndWFnZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYTtcbiIsInZhciBNZXRpc2FDb3JlID0gcmVxdWlyZSgnLi4vY29yZScpO1xudmFyIHdpdGhJRnJhbWUgPSByZXF1aXJlKCcuL3dpdGhJRnJhbWUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xudmFyIGNvbXBvc2UgPSB1dGlsLmNvbXBvc2U7XG5cbi8qKlxuICAqIEJhc2UgY2xhc3MgZm9yIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICpcbiAgKiBUaGlzIGlzIGluaXRpYWxpc2VkIGFuZCBleHBvc2VkIHRvIGB3aW5kb3cuTWV0aXNhYCB3aGVuIHlvdSBpbXBvcnQgdGhyb3VnaCBvdXIgW2V4YW1wbGVdKC8jaW5zdGFsbGF0aW9uKS5cbiAgKlxuICAqIEBjbGFzc1xuICAqL1xuY2xhc3MgTWV0aXNhRG9tIGV4dGVuZHMgY29tcG9zZShNZXRpc2FDb3JlKSh3aXRoSUZyYW1lKSB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvciAtIGNyZWF0ZSBNZXRpc2FEb21cbiAgICpcbiAgICogQHBhcmFtICB7b2JqZWN0fSBvcHRzIG9wdGlvbnMgb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2FDb3JlIGNvbnRydWN0b3JcbiAgICogQHBhcmFtICB7c3RyaW5nfSBvcHRzLnN0b3JlIG5hbWUgb2YgeW91ciBzdG9yZVxuXG4gICAqIEByZXR1cm4ge2NsYXNzfSAgTWV0aXNhRG9tXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICBpZiAoJCA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIERvbSByZXF1aXJlcyBqUXVlcnkgdG8gYmUgYXZhaWxhYmxlIScpXG4gICAgICB9XG4gICAgICBzdXBlcihvcHRzKTtcblxuICAgICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSBEb20gd2l0aCAke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9IWApO1xuICAgICAgdGhpcy5yZW5kZXJXaWRnZXQgPSB0aGlzLnJlbmRlcldpZGdldC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5yZWdpc3Rlck9wdGlvbnMgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucy5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLmF0dGFjaFJlZ2lzdGVyT3B0aW9uc1RvV2luZG93KCk7XG4gIH1cblxuICBhdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpIHtcbiAgICAgIHdpbmRvdy5tdCA9IHRoaXMucmVnaXN0ZXJPcHRpb25zO1xuICB9XG5cbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xuICAgIHN1cGVyLnJlZ2lzdGVyT3B0aW9ucy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNSZWFkeVRvU3RhcnQpIHtcbiAgICAgIHRoaXMucmVuZGVyV2lkZ2V0KCk7XG4gICAgICB0aGlzLmN1c3RvbUludGVncmF0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyV2lkZ2V0KCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgd2lkZ2V0cyA9ICQoJy5tdC13aWRnZXQnKTtcblxuICAgIC8vIENvbnZlcnQgd2lkZ2V0cyBub2RlbGlzdCB0byB0cnVlIGFycmF5XG4gICAgd2lkZ2V0cyA9ICQubWFrZUFycmF5KHdpZGdldHMpO1xuXG4gICAgd2lkZ2V0cy5mb3JFYWNoKGZ1bmN0aW9uKHdpZGdldCkge1xuICAgICAgLy8gUmVuZGVyIHdpZGdldCB1c2luZyBBamF4IHNvIHdlIGNhbiBncmFjZWZ1bGx5IGRlZ3JhZGUgaWYgdGhlcmUgaXMgbm8gY29udGVudCBhdmFpbGFibGVcbiAgICAgIHZhciB3aWRnZXRJZCA9IHdpZGdldC5kYXRhc2V0LndpZGdldElkLFxuICAgICAgICAgIGN1c3RvbWVySWQgPSB3aWRnZXQuZGF0YXNldC5jdXN0b21lcklkLFxuICAgICAgICAgIHByb2R1Y3RJZCA9IHdpZGdldC5kYXRhc2V0LnByb2R1Y3RJZCxcbiAgICAgICAgICBjYXRlZ29yeU5hbWUgPSB3aWRnZXQuZGF0YXNldC5jYXRlZ29yeU5hbWUsXG4gICAgICAgICAgYnJhbmRuYW1lID0gd2lkZ2V0LmRhdGFzZXQuYnJhbmRuYW1lLFxuICAgICAgICAgIHNlc3Npb25JZCA9IHdpZGdldC5kYXRhc2V0LnNlc3Npb25JZCxcbiAgICAgICAgICBsYW5ndWFnZSA9IHdpZGdldC5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICAgIHVybCA9IHRoaXMub3B0cy5iYXNlVXJsICsgdGhpcy5zbHVnICsgJy9hcGkvdjEvd2lkZ2V0LWN1c3RvbWVyP3dpZGdldF9pZD0nICsgd2lkZ2V0SWQ7XG5cbiAgICAgIC8vIE92ZXJyaWRlIGN1c3RvbWVyLCBjYXRlZ29yeSBvciBicmFuZFxuICAgICAgaWYgKGN1c3RvbWVySWQpIHRoaXMuY3VzdG9tZXJJZCA9IGN1c3RvbWVySWQ7XG4gICAgICBpZiAocHJvZHVjdElkKSB0aGlzLnByb2R1Y3RJZCA9IHByb2R1Y3RJZDtcbiAgICAgIGlmIChjYXRlZ29yeU5hbWUpIHRoaXMuY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnlOYW1lO1xuICAgICAgaWYgKGJyYW5kbmFtZSkgdGhpcy5icmFuZG5hbWUgPSBicmFuZG5hbWU7XG4gICAgICBpZiAoc2Vzc2lvbklkKSB0aGlzLnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICAgIGlmIChsYW5ndWFnZSkgdGhpcy5sYW5ndWFnZSA9IGxhbmd1YWdlO1xuXG4gICAgICBpZiAodGhpcy5jdXN0b21lcklkKSB7XG4gICAgICAgIHVybCArPSAnJmN1c3RvbWVyX2lkPScgKyBlc2NhcGUodGhpcy5jdXN0b21lcklkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJvZHVjdElkKSB7XG4gICAgICAgIHVybCArPSAnJnByb2R1Y3RfaWQ9JyArIGVzY2FwZSh0aGlzLnByb2R1Y3RJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNhdGVnb3J5TmFtZSkge1xuICAgICAgICB1cmwgKz0gJyZjYXRlZ29yeV9uYW1lPScgKyBlc2NhcGUodGhpcy5jYXRlZ29yeU5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5icmFuZG5hbWUpIHtcbiAgICAgICAgdXJsICs9ICcmYnJhbmRuYW1lPScgKyBlc2NhcGUodGhpcy5icmFuZG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5nZW5kZXIpIHtcbiAgICAgICAgdXJsICs9ICcmZ2VuZGVyPScgKyBlc2NhcGUodGhpcy5nZW5kZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZXNzaW9uSWQpIHtcbiAgICAgICAgdXJsICs9ICcmc2Vzc2lvbl9pZD0nICsgZXNjYXBlKHRoaXMuc2Vzc2lvbklkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubGFuZ3VhZ2UpIHtcbiAgICAgICAgdXJsICs9ICcmbGFuZ3VhZ2U9JyArIGVzY2FwZSh0aGlzLmxhbmd1YWdlKTtcbiAgICAgIH1cblxuICAgICAgdXJsICs9ICcmZm9ybWF0PWh0bWwnO1xuICAgICAgLy8gUHJlcGFyZSBpZnJhbWVcbiAgICAgIHZhciBpZnJhbWUgPSBzZWxmLmNyZWF0ZUlGcmFtZVdpdGhJZCh3aWRnZXRJZCk7XG5cbiAgICAgIHdpZGdldC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgICAvLyBSZW5kZXIgbG9hZGVyXG4gICAgICB2YXIgaHRtbCA9IHNlbGYuZ2V0TG9hZGVySFRNTCgpO1xuXG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZShodG1sKTtcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmNsb3NlKCk7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSlcbiAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAvLyBEZWxldGUgbG9hZGVyIGlmcmFtZVxuICAgICAgICB2YXIgb2xkSUZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpZGdldC0nICtcbiAgICAgICAgd2lkZ2V0SWQpO1xuXG4gICAgICAgIHZhciBpZnJhbWVQYXJlbnQgPSBvbGRJRnJhbWUucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAoaWZyYW1lUGFyZW50KSB7XG4gICAgICAgICAgd2hpbGUgKGlmcmFtZVBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBpZnJhbWVQYXJlbnQucmVtb3ZlQ2hpbGQoaWZyYW1lUGFyZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpZnJhbWUgZm9yIHdpZGdldFxuICAgICAgICB2YXIgaWZyYW1lID0gc2VsZi5jcmVhdGVJRnJhbWVXaXRoSWQod2lkZ2V0SWQpO1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgICAgICB2YXIgaHRtbCA9IHNlbGYuZGVjb2RlSHRtbEVudGl0aWVzKGRhdGEpO1xuXG4gICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICczMHB4JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSHRtbCB3aWxsIGJlIGVtcHR5IGlmIHN0b3JlIGhhcyBydW4gb3V0IG9mIGZyZWUgc2FsZXMgY3JlZGl0cy5cbiAgICAgICAgICAgIC8vIEdyYWNlZnVsbHkgZmFpbCB0byBsb2FkIHdpZGdldCBieSByZW1vdmluZyB0aGUgaWZyYW1lIGZyb20gRE9NLlxuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgc3RhdHVzVGV4dCk7XG4gICAgICAgICAgLy8gUmVtb3ZlIGlmcmFtZSBmcm9tIERPTVxuICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cblxuICBjdXN0b21JbnRlZ3JhdGlvbigpIHtcbiAgICBpZiAodGhpcy50b2tlbklkKSB7XG4gICAgICB2YXIgdXJsLCBkYXRhO1xuICAgICAgaWYgKHRoaXMucHJvZHVjdCkge1xuICAgICAgICAvLyBVcGRhdGUgcHJvZHVjdFxuICAgICAgICB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMub3B0cy5wcm9kdWN0RW5kcG9pbnQ7XG4gICAgICAgIGRhdGEgPSB0aGlzLnByb2R1Y3Q7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3JkZXIpIHtcbiAgICAgICAgLy8gU3VibWl0IG9yZGVyXG4gICAgICAgIHVybCA9IHRoaXMub3B0cy5iYXNlVXJsICsgdGhpcy5vcHRzLm9yZGVyRW5kcG9pbnQ7XG4gICAgICAgIGRhdGEgPSB0aGlzLm9yZGVyO1xuICAgICAgfVxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1DU1JGVG9rZW4nLCB0aGlzLnRva2VuSWQpO1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgICB9LFxuICAgICAgICBzdGF0dXNDb2RlOiB7XG4gICAgICAgICAgNTAwOiBmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcreGhyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbG9nKCkge1xuICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0aXNhRG9tO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb21wb3NlZENsYXNzKSB7XG4gIHJldHVybiBjbGFzcyBJRnJhbWUgZXh0ZW5kcyBjb21wb3NlZENsYXNzIHtcbiAgICBjcmVhdGVJRnJhbWVXaXRoSWQoaWQpIHtcbiAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnYm9yZGVyOiAwcHg7IHdpZHRoOiAxMDAlOycpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVib3JkZXInLCAnMCcpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc2Nyb2xsaW5nJywgJ25vJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdvbmxvYWQnLCAnd2luZG93Lk1ldGlzYS5yZXNpemVJZnJhbWUodGhpcyknKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpZGdldC0nICsgaWQpO1xuXG4gICAgICByZXR1cm4gaWZyYW1lO1xuICAgIH1cblxuICAgIHJlc2l6ZUlmcmFtZShvYmopIHtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgb2JqLnN0eWxlLmhlaWdodCA9IG9iai5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9XG5cbiAgICBnZXRMb2FkZXJIVE1MKCkge1xuICAgICAgcmV0dXJuICc8IWRvY3R5cGUgaHRtbD48aHRtbD48c3R5bGU+Ym9keXtoZWlnaHQ6IDEwMHB4O30uY3MtbG9hZGVye2hlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7fS5jcy1sb2FkZXItaW5uZXJ7dHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpOyB0b3A6IDUwJTsgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDogY2FsYygxMDAlIC0gMjAwcHgpOyBjb2xvcjogI0EyQTNBMzsgcGFkZGluZzogMCAxMDBweDsgdGV4dC1hbGlnbjogY2VudGVyO30uY3MtbG9hZGVyLWlubmVyIGxhYmVse2ZvbnQtc2l6ZTogMjBweDsgb3BhY2l0eTogMDsgZGlzcGxheTogaW5saW5lLWJsb2NrO31Aa2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTt9MzMle29wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO302NiV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTt9fUAtd2Via2l0LWtleWZyYW1lcyBsb2x7MCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTt9MzMle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO30xMDAle29wYWNpdHk6IDA7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTt9fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDYpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg1KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAxMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNCl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMjAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDMpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDMwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgyKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA0MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMSl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgNTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fTwvc3R5bGU+PGJvZHk+IDxkaXYgY2xhc3M9XCJjcy1sb2FkZXJcIj4gPGRpdiBjbGFzcz1cImNzLWxvYWRlci1pbm5lclwiPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8L2Rpdj48L2Rpdj48L2JvZHk+PC9odG1sPic7XG4gICAgfVxuXG4gICAgZGVjb2RlSHRtbEVudGl0aWVzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIz8oXFx3Kyk7L2csIGZ1bmN0aW9uKG1hdGNoLCBkZWMpIHtcbiAgICAgICAgaWYgKGlzTmFOKGRlYykpIHtcbiAgICAgICAgICB2YXIgY2hhcnMgPSB7XG4gICAgICAgICAgICAgIHF1b3Q6IDM0LFxuICAgICAgICAgICAgICBhbXA6IDM4LFxuICAgICAgICAgICAgICBsdDogNjAsXG4gICAgICAgICAgICAgIGd0OiA2MixcbiAgICAgICAgICAgICAgbmJzcDogMTYwLFxuICAgICAgICAgICAgICBjb3B5OiAxNjksXG4gICAgICAgICAgICAgIHJlZzogMTc0LFxuICAgICAgICAgICAgICBkZWc6IDE3NixcbiAgICAgICAgICAgICAgZnJhc2w6IDQ3LFxuICAgICAgICAgICAgICB0cmFkZTogODQ4MixcbiAgICAgICAgICAgICAgZXVybzogODM2NCxcbiAgICAgICAgICAgICAgQWdyYXZlOiAxOTIsXG4gICAgICAgICAgICAgIEFhY3V0ZTogMTkzLFxuICAgICAgICAgICAgICBBY2lyYzogMTk0LFxuICAgICAgICAgICAgICBBdGlsZGU6IDE5NSxcbiAgICAgICAgICAgICAgQXVtbDogMTk2LFxuICAgICAgICAgICAgICBBcmluZzogMTk3LFxuICAgICAgICAgICAgICBBRWxpZzogMTk4LFxuICAgICAgICAgICAgICBDY2VkaWw6IDE5OSxcbiAgICAgICAgICAgICAgRWdyYXZlOiAyMDAsXG4gICAgICAgICAgICAgIEVhY3V0ZTogMjAxLFxuICAgICAgICAgICAgICBFY2lyYzogMjAyLFxuICAgICAgICAgICAgICBFdW1sOiAyMDMsXG4gICAgICAgICAgICAgIElncmF2ZTogMjA0LFxuICAgICAgICAgICAgICBJYWN1dGU6IDIwNSxcbiAgICAgICAgICAgICAgSWNpcmM6IDIwNixcbiAgICAgICAgICAgICAgSXVtbDogMjA3LFxuICAgICAgICAgICAgICBFVEg6IDIwOCxcbiAgICAgICAgICAgICAgTnRpbGRlOiAyMDksXG4gICAgICAgICAgICAgIE9ncmF2ZTogMjEwLFxuICAgICAgICAgICAgICBPYWN1dGU6IDIxMSxcbiAgICAgICAgICAgICAgT2NpcmM6IDIxMixcbiAgICAgICAgICAgICAgT3RpbGRlOiAyMTMsXG4gICAgICAgICAgICAgIE91bWw6IDIxNCxcbiAgICAgICAgICAgICAgdGltZXM6IDIxNSxcbiAgICAgICAgICAgICAgT3NsYXNoOiAyMTYsXG4gICAgICAgICAgICAgIFVncmF2ZTogMjE3LFxuICAgICAgICAgICAgICBVYWN1dGU6IDIxOCxcbiAgICAgICAgICAgICAgVWNpcmM6IDIxOSxcbiAgICAgICAgICAgICAgVXVtbDogMjIwLFxuICAgICAgICAgICAgICBZYWN1dGU6IDIyMSxcbiAgICAgICAgICAgICAgVEhPUk46IDIyMixcbiAgICAgICAgICAgICAgc3psaWc6IDIyMyxcbiAgICAgICAgICAgICAgYWdyYXZlOiAyMjQsXG4gICAgICAgICAgICAgIGFhY3V0ZTogMjI1LFxuICAgICAgICAgICAgICBhY2lyYzogMjI2LFxuICAgICAgICAgICAgICBhdGlsZGU6IDIyNyxcbiAgICAgICAgICAgICAgYXVtbDogMjI4LFxuICAgICAgICAgICAgICBhcmluZzogMjI5LFxuICAgICAgICAgICAgICBhZWxpZzogMjMwLFxuICAgICAgICAgICAgICBjY2VkaWw6IDIzMSxcbiAgICAgICAgICAgICAgZWdyYXZlOiAyMzIsXG4gICAgICAgICAgICAgIGVhY3V0ZTogMjMzLFxuICAgICAgICAgICAgICBlY2lyYzogMjM0LFxuICAgICAgICAgICAgICBldW1sOiAyMzUsXG4gICAgICAgICAgICAgIGlncmF2ZTogMjM2LFxuICAgICAgICAgICAgICBpYWN1dGU6IDIzNyxcbiAgICAgICAgICAgICAgaWNpcmM6IDIzOCxcbiAgICAgICAgICAgICAgaXVtbDogMjM5LFxuICAgICAgICAgICAgICBldGg6IDI0MCxcbiAgICAgICAgICAgICAgbnRpbGRlOiAyNDEsXG4gICAgICAgICAgICAgIG9ncmF2ZTogMjQyLFxuICAgICAgICAgICAgICBvYWN1dGU6IDI0MyxcbiAgICAgICAgICAgICAgb2NpcmM6IDI0NCxcbiAgICAgICAgICAgICAgb3RpbGRlOiAyNDUsXG4gICAgICAgICAgICAgIG91bWw6IDI0NixcbiAgICAgICAgICAgICAgZGl2aWRlOiAyNDcsXG4gICAgICAgICAgICAgIG9zbGFzaDogMjQ4LFxuICAgICAgICAgICAgICB1Z3JhdmU6IDI0OSxcbiAgICAgICAgICAgICAgdWFjdXRlOiAyNTAsXG4gICAgICAgICAgICAgIHVjaXJjOiAyNTEsXG4gICAgICAgICAgICAgIHV1bWw6IDI1MixcbiAgICAgICAgICAgICAgeWFjdXRlOiAyNTMsXG4gICAgICAgICAgICAgIHRob3JuOiAyNTQsXG4gICAgICAgICAgICAgIHl1bWw6IDI1NSxcbiAgICAgICAgICAgICAgbHNxdW86IDgyMTYsXG4gICAgICAgICAgICAgIHJzcXVvOiA4MjE3LFxuICAgICAgICAgICAgICBzYnF1bzogODIxOCxcbiAgICAgICAgICAgICAgbGRxdW86IDgyMjAsXG4gICAgICAgICAgICAgIHJkcXVvOiA4MjIxLFxuICAgICAgICAgICAgICBiZHF1bzogODIyMixcbiAgICAgICAgICAgICAgZGFnZ2VyOiA4MjI0LFxuICAgICAgICAgICAgICBEYWdnZXI6IDgyMjUsXG4gICAgICAgICAgICAgIHBlcm1pbDogODI0MCxcbiAgICAgICAgICAgICAgbHNhcXVvOiA4MjQ5LFxuICAgICAgICAgICAgICByc2FxdW86IDgyNTAsXG4gICAgICAgICAgICAgIHNwYWRlczogOTgyNCxcbiAgICAgICAgICAgICAgY2x1YnM6IDk4MjcsXG4gICAgICAgICAgICAgIGhlYXJ0czogOTgyOSxcbiAgICAgICAgICAgICAgZGlhbXM6IDk4MzAsXG4gICAgICAgICAgICAgIG9saW5lOiA4MjU0LFxuICAgICAgICAgICAgICBsYXJyOiA4NTkyLFxuICAgICAgICAgICAgICB1YXJyOiA4NTkzLFxuICAgICAgICAgICAgICByYXJyOiA4NTk0LFxuICAgICAgICAgICAgICBkYXJyOiA4NTk1LFxuICAgICAgICAgICAgICBoZWxsaXA6IDEzMyxcbiAgICAgICAgICAgICAgbmRhc2g6IDE1MCxcbiAgICAgICAgICAgICAgbWRhc2g6IDE1MSxcbiAgICAgICAgICAgICAgaWV4Y2w6IDE2MSxcbiAgICAgICAgICAgICAgY2VudDogMTYyLFxuICAgICAgICAgICAgICBwb3VuZDogMTYzLFxuICAgICAgICAgICAgICBjdXJyZW46IDE2NCxcbiAgICAgICAgICAgICAgeWVuOiAxNjUsXG4gICAgICAgICAgICAgIGJydmJhcjogMTY2LFxuICAgICAgICAgICAgICBicmtiYXI6IDE2NixcbiAgICAgICAgICAgICAgc2VjdDogMTY3LFxuICAgICAgICAgICAgICB1bWw6IDE2OCxcbiAgICAgICAgICAgICAgZGllOiAxNjgsXG4gICAgICAgICAgICAgIG9yZGY6IDE3MCxcbiAgICAgICAgICAgICAgbGFxdW86IDE3MSxcbiAgICAgICAgICAgICAgbm90OiAxNzIsXG4gICAgICAgICAgICAgIHNoeTogMTczLFxuICAgICAgICAgICAgICBtYWNyOiAxNzUsXG4gICAgICAgICAgICAgIGhpYmFyOiAxNzUsXG4gICAgICAgICAgICAgIHBsdXNtbjogMTc3LFxuICAgICAgICAgICAgICBzdXAyOiAxNzgsXG4gICAgICAgICAgICAgIHN1cDM6IDE3OSxcbiAgICAgICAgICAgICAgYWN1dGU6IDE4MCxcbiAgICAgICAgICAgICAgbWljcm86IDE4MSxcbiAgICAgICAgICAgICAgcGFyYTogMTgyLFxuICAgICAgICAgICAgICBtaWRkb3Q6IDE4MyxcbiAgICAgICAgICAgICAgY2VkaWw6IDE4NCxcbiAgICAgICAgICAgICAgc3VwMTogMTg1LFxuICAgICAgICAgICAgICBvcmRtOiAxODYsXG4gICAgICAgICAgICAgIHJhcXVvOiAxODcsXG4gICAgICAgICAgICAgIGZyYWMxNDogMTg4LFxuICAgICAgICAgICAgICBmcmFjMTI6IDE4OSxcbiAgICAgICAgICAgICAgZnJhYzM0OiAxOTAsXG4gICAgICAgICAgICAgIGlxdWVzdDogMTkxLFxuICAgICAgICAgICAgICBBbHBoYTogOTEzLFxuICAgICAgICAgICAgICBhbHBoYTogOTQ1LFxuICAgICAgICAgICAgICBCZXRhOiA5MTQsXG4gICAgICAgICAgICAgIGJldGE6IDk0NixcbiAgICAgICAgICAgICAgR2FtbWE6IDkxNSxcbiAgICAgICAgICAgICAgZ2FtbWE6IDk0NyxcbiAgICAgICAgICAgICAgRGVsdGE6IDkxNixcbiAgICAgICAgICAgICAgZGVsdGE6IDk0OCxcbiAgICAgICAgICAgICAgRXBzaWxvbjogOTE3LFxuICAgICAgICAgICAgICBlcHNpbG9uOiA5NDksXG4gICAgICAgICAgICAgIFpldGE6IDkxOCxcbiAgICAgICAgICAgICAgemV0YTogOTUwLFxuICAgICAgICAgICAgICBFdGE6IDkxOSxcbiAgICAgICAgICAgICAgZXRhOiA5NTEsXG4gICAgICAgICAgICAgIFRoZXRhOiA5MjAsXG4gICAgICAgICAgICAgIHRoZXRhOiA5NTIsXG4gICAgICAgICAgICAgIElvdGE6IDkyMSxcbiAgICAgICAgICAgICAgaW90YTogOTUzLFxuICAgICAgICAgICAgICBLYXBwYTogOTIyLFxuICAgICAgICAgICAgICBrYXBwYTogOTU0LFxuICAgICAgICAgICAgICBMYW1iZGE6IDkyMyxcbiAgICAgICAgICAgICAgbGFtYmRhOiA5NTUsXG4gICAgICAgICAgICAgIE11OiA5MjQsXG4gICAgICAgICAgICAgIG11OiA5NTYsXG4gICAgICAgICAgICAgIE51OiA5MjUsXG4gICAgICAgICAgICAgIG51OiA5NTcsXG4gICAgICAgICAgICAgIFhpOiA5MjYsXG4gICAgICAgICAgICAgIHhpOiA5NTgsXG4gICAgICAgICAgICAgIE9taWNyb246IDkyNyxcbiAgICAgICAgICAgICAgb21pY3JvbjogOTU5LFxuICAgICAgICAgICAgICBQaTogOTI4LFxuICAgICAgICAgICAgICBwaTogOTYwLFxuICAgICAgICAgICAgICBSaG86IDkyOSxcbiAgICAgICAgICAgICAgcmhvOiA5NjEsXG4gICAgICAgICAgICAgIFNpZ21hOiA5MzEsXG4gICAgICAgICAgICAgIHNpZ21hOiA5NjMsXG4gICAgICAgICAgICAgIFRhdTogOTMyLFxuICAgICAgICAgICAgICB0YXU6IDk2NCxcbiAgICAgICAgICAgICAgVXBzaWxvbjogOTMzLFxuICAgICAgICAgICAgICB1cHNpbG9uOiA5NjUsXG4gICAgICAgICAgICAgIFBoaTogOTM0LFxuICAgICAgICAgICAgICBwaGk6IDk2NixcbiAgICAgICAgICAgICAgQ2hpOiA5MzUsXG4gICAgICAgICAgICAgIGNoaTogOTY3LFxuICAgICAgICAgICAgICBQc2k6IDkzNixcbiAgICAgICAgICAgICAgcHNpOiA5NjgsXG4gICAgICAgICAgICAgIE9tZWdhOiA5MzcsXG4gICAgICAgICAgICAgIG9tZWdhOiA5NjlcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGNoYXJzW2RlY10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVjID0gY2hhcnNbZGVjXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZGVjKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG4iLCJjb25zdCBNZXRpc2FEb20gPSByZXF1aXJlKCcuL01ldGlzYS9kb20nKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGlmICh1dGlsLmVudmlyb25tZW50ICE9PSAnYnJvd3NlcicgKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIGJyb3dzZXIgY2FuIG9ubHkgcnVuIGluc2lkZSBhIGJyb3dzZXInKTtcbiAgfVxuICB3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSAkIHx8IGpRdWVyeSB8fCB7fTtcblxuICB3aW5kb3cuTWV0aXNhID0gbmV3IE1ldGlzYURvbSgpO1xufSkoKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50OiB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/ICdicm93c2VyJyA6ICdub2RlJyxcbiAgICBjb21wb3NlOiBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBjb21wb3NpdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICB2YXIgY29tcG9zZWQgPSBvcmlnaW5hbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb21wb3NlZCA9IGNvbXBvc2l0aW9uc1tpXShjb21wb3NlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvc2VkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pKCk7XG4iXX0=
