(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Metisa {
  constructor(opts) {
    opts = opts || {};
    this.opts = Object.assign(
      {
        baseUrl: 'https://askmetisa.com/',
        productEndpoint: "metisa/api/v1/product",
        orderEndpoint: "metisa/api/v1/order",
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
    this.tryStart();
  }
};
module.exports = Metisa;

},{}],2:[function(require,module,exports){
var MetisaCore = require('../core');
var withIFrame = require('./withIFrame');
var util = require('../../util');
var compose = util.compose;

class MetisaDom extends compose(MetisaCore)(withIFrame) {
  constructor(opts) {
    if ($ == null) { return console.warn('Metisa Dom requires jQuery to be available!')}
    super(opts);

    console.log(`initialised Metisa Dom with ${JSON.stringify(this.opts)}!`);
    this.renderWidget = this.renderWidget.bind(this);

    this.attachRegisterOptionsToWindow();
  }

  attachRegisterOptionsToWindow() {
    window.mt = this.registerOptions.bind(this);
  }

  tryStart() {
    this.renderWidget();
    this.customIntegration();
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
          xmlhttp = new XMLHttpRequest(),
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
      .done(function(data, statusText, xhr){
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
      if (this.product) {
        // Update product
        // $.get(this.baseUrl+this.productEndpoint)
        // .done(function(data) {
        //     console.log(data);
        // });
      }
      else if (this.order) {
        var token = this.tokenId;
        // Submit order
        $.ajaxSetup({
          beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", token);
          }
        });
        $.ajax({
          type: "POST",
          url: this.baseUrl + this.orderEndpoint,
          data: JSON.stringify(this.order),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (msg) {
            console.log(msg);
          },
          error: function (errormessage) {
           console.log(errormessage);
          }
        });
      }
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

},{}]},{},[4]);
