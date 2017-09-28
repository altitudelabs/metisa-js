(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":6}],2:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":1,"./_getRawTag":4,"./_objectToString":5}],3:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":1}],5:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],6:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":3}],7:[function(require,module,exports){
var toInteger = require('./toInteger');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

module.exports = before;

},{"./toInteger":13}],8:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],9:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],10:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":2,"./isObjectLike":9}],11:[function(require,module,exports){
var before = require('./before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */
function once(func) {
  return before(2, func);
}

module.exports = once;

},{"./before":7}],12:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":14}],13:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":12}],14:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":8,"./isSymbol":10}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
var MetisaCore = require('../core');
var withIFrame = require('./withIFrame');
var util = require('../../util');
var _ = {
  once: require('lodash/once')
};
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
    this.renderWidget = _.once(this.renderWidget);
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
   * Only gets called once
   */
  renderWidget() {
    this.renderWidgetCalled = true;
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
    console.log('tracking ', cat);
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

},{"../../util":19,"../core":15,"./withIFrame":17,"lodash/once":11}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./Metisa/dom":16,"./util":19}],19:[function(require,module,exports){
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

},{}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvYmVmb3JlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvb25jZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9GaW5pdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gKiBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hpbGUgaXQncyBjYWxsZWQgbGVzcyB0aGFuIGBuYCB0aW1lcy4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGNhbGxzIGF0IHdoaWNoIGBmdW5jYCBpcyBubyBsb25nZXIgaW52b2tlZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcmVzdHJpY3RlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uYmVmb3JlKDUsIGFkZENvbnRhY3RUb0xpc3QpKTtcbiAqIC8vID0+IEFsbG93cyBhZGRpbmcgdXAgdG8gNCBjb250YWN0cyB0byB0aGUgbGlzdC5cbiAqL1xuZnVuY3Rpb24gYmVmb3JlKG4sIGZ1bmMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgbiA9IHRvSW50ZWdlcihuKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICgtLW4gPiAwKSB7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGlmIChuIDw9IDEpIHtcbiAgICAgIGZ1bmMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVmb3JlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgYmVmb3JlID0gcmVxdWlyZSgnLi9iZWZvcmUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGludm9raW5nIGBmdW5jYCBvbmNlLiBSZXBlYXQgY2FsbHNcbiAqIHRvIHRoZSBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnZvY2F0aW9uLiBUaGUgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBpbml0aWFsaXplID0gXy5vbmNlKGNyZWF0ZUFwcGxpY2F0aW9uKTtcbiAqIGluaXRpYWxpemUoKTtcbiAqIGluaXRpYWxpemUoKTtcbiAqIC8vID0+IGBjcmVhdGVBcHBsaWNhdGlvbmAgaXMgaW52b2tlZCBvbmNlXG4gKi9cbmZ1bmN0aW9uIG9uY2UoZnVuYykge1xuICByZXR1cm4gYmVmb3JlKDIsIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgZmluaXRlIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTIuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvRmluaXRlKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b0Zpbml0ZShJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9GaW5pdGUoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gdmFsdWUgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRmluaXRlO1xuIiwidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwiLyoqXHJcbiAqIE9wdGlvbnMgb2JqZWN0IGRlZmluaXRpb25cclxuICogQHByaXZhdGVcclxuICogQHR5cGVkZWYge09iamVjdH0gT3B0c1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmFzZVVybD1odHRwczovL2Fza21ldGlzYS5jb20vIEJhc2UgVVJMIG9mIEFQSVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaXRlbUVuZHBvaW50PS9hcGkvdjEvcHJvZHVjdC1jb2xsZWN0aW9uIFBhdGggb2YgQVBJIGVuZHBvaW50IGZvciBjcmVhdGluZyBvciB1cGRhdGluZyBpdGVtc1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYWN0aW9uRW5kcG9pbnQ9L2FwaS92MS9vcmRlci10cmFuc2FjdGlvbiBQYXRoIG9mIEFQSSBlbmRwb2ludCBmb3IgY3JlYXRpbmcgb3IgdXBkYXRpbmcgYWN0aW9uc1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciBhbnkgZW52aXJvbm1lbnQuXHJcblxyXG4gKi9cclxuY2xhc3MgTWV0aXNhIHtcclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBNZXRpc2FgIHdpdGggYG9wdHNgLlxyXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0cyBPcHRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2EgY29udHJ1Y3RvclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcclxuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbihcclxuICAgICAge1xyXG4gICAgICAgIGJhc2VVcmw6ICdodHRwczovL2Fza21ldGlzYS5jb20vJyxcclxuICAgICAgICBpdGVtRW5kcG9pbnQ6IFwiL2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb25cIixcclxuICAgICAgICBhY3Rpb25FbmRwb2ludDogXCIvYXBpL3YxL29yZGVyLXRyYW5zYWN0aW9uXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIG9wdHNcclxuICAgICk7XHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gd3JpdGUgbG9ncyBpbiBicm93c2VyIGNvbnNvbGVcclxuICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICB0aGlzLmRlYnVnID0gdHJ1ZTtcclxuICAgIGNvbnNvbGUubG9nKGBpbml0aWFsaXNlZCBNZXRpc2Egd2l0aCAke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9IWApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgcmVhZHkgdG8gc3RhcnQgY2FsbGluZyBBUEkuXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZ2V0IGlzUmVhZHlUb1N0YXJ0KCkge1xyXG4gICAgdmFyIGlzUmVhZHkgPSBmYWxzZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWAuXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xyXG4gICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2Jhc2VVcmwnKSB7XHJcbiAgICAgIC8vIEluaXQgQmFzZSBVUkwgZm9yIHRlc3RpbmdcclxuICAgICAgdGhpcy5sb2coJ0Jhc2UgVVJMIGlzJywgYXJndW1lbnRzWzFdKTtcclxuICAgICAgdGhpcy5vcHRzLmJhc2VVcmwgPSBhcmd1bWVudHNbMV07IC8vIG92ZXJyaWRlXHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2l0ZW0nKSB7XHJcbiAgICAgIC8vIEluaXQgSXRlbSBvYmplY3RcclxuICAgICAgdGhpcy5sb2coJ0l0ZW0gaXMnLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICB0aGlzLml0ZW0gPSBhcmd1bWVudHNbMV07XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2FjdGlvbicpIHtcclxuICAgICAgLy8gSW5pdCBBY3Rpb24gb2JqZWN0XHJcbiAgICAgIHRoaXMubG9nKCdBY3Rpb24gaXMnLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICB0aGlzLmFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcclxuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnc2x1ZycpIHtcclxuICAgICAgLy8gSW5pdCBzdG9yZSBzbHVnXHJcbiAgICAgIHRoaXMubG9nKCdTdG9yZSBzbHVnIGlzJywgYXJndW1lbnRzWzFdKTtcclxuICAgICAgdGhpcy5zbHVnID0gYXJndW1lbnRzWzFdO1xyXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICd1c2VyJykge1xyXG4gICAgICAvLyBJbml0IHVzZXIgYmFzZWQgcmVjb21tZW5kYXRpb25zXHJcbiAgICAgIHRoaXMubG9nKCdVc2VyIElEIGlzJywgYXJndW1lbnRzWzFdKTtcclxuICAgICAgdGhpcy51c2VySWQgPSBhcmd1bWVudHNbMV07XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2NhdGVnb3J5Jykge1xyXG4gICAgICAvLyBJbml0IGNhdGVnb3J5XHJcbiAgICAgIHRoaXMubG9nKCdDYXRlZ29yeSBpcycsIGFyZ3VtZW50c1sxXSk7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlOYW1lID0gYXJndW1lbnRzWzFdO1xyXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdicmFuZCcpIHtcclxuICAgICAgLy8gSW5pdCBicmFuZFxyXG4gICAgICB0aGlzLmxvZygnQnJhbmQgaXMnLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICB0aGlzLmJyYW5kbmFtZSA9IGFyZ3VtZW50c1sxXTtcclxuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnaXRlbUlkJykge1xyXG4gICAgICAvLyBJbml0IGl0ZW0gaWRcclxuICAgICAgdGhpcy5sb2coJ0l0ZW0gSUQgaXMnLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICB0aGlzLml0ZW1JZCA9IGFyZ3VtZW50c1sxXTtcclxuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnZ2VuZGVyJykge1xyXG4gICAgICAvLyBJbml0IGdlbmRlclxyXG4gICAgICB0aGlzLmxvZygnR2VuZGVyIGlzJywgYXJndW1lbnRzWzFdKTtcclxuICAgICAgdGhpcy5nZW5kZXIgPSBhcmd1bWVudHNbMV07XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Nlc3Npb24nKSB7XHJcbiAgICAgIC8vIEluaXQgc2Vzc2lvblxyXG4gICAgICB0aGlzLmxvZygnU2Vzc2lvbiBpcycsIGFyZ3VtZW50c1sxXSlcclxuICAgICAgdGhpcy5zZXNzaW9uSWQgPSBhcmd1bWVudHNbMV07XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2xhbmd1YWdlJykge1xyXG4gICAgICB0aGlzLmxvZygnTGFuZ3VhZ2UgaXMnLCBhcmd1bWVudHNbMV0pXHJcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBhcmd1bWVudHNbMV07XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYTtcclxuIiwidmFyIE1ldGlzYUNvcmUgPSByZXF1aXJlKCcuLi9jb3JlJyk7XHJcbnZhciB3aXRoSUZyYW1lID0gcmVxdWlyZSgnLi93aXRoSUZyYW1lJyk7XHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpO1xyXG52YXIgXyA9IHtcclxuICBvbmNlOiByZXF1aXJlKCdsb2Rhc2gvb25jZScpXHJcbn07XHJcbnZhciBjb21wb3NlID0gdXRpbC5jb21wb3NlO1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBjbGFzc1xyXG4gKiBAY2xhc3NkZXNjIHtAbGluayBNZXRpc2F9IGNsYXNzIHRoYXQgY29tcG9zZXMgd2l0aCB7QGxpbmsgY29tcG9zZUNsYXNzLklGcmFtZX1cclxuICogQHJlcXVpcmVzIE1ldGlzYVxyXG4gKiBAcmVxdWlyZXMgY29tcG9zZUNsYXNzXHJcbiAqIEByZXF1aXJlcyBnZXRVdGlsLmNvbXBvc2VcclxuICovXHJcbnZhciBNZXRpc2F3aXRoSUZyYW1lID0gY29tcG9zZShNZXRpc2FDb3JlKSh3aXRoSUZyYW1lKTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAY2xhc3NcclxuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciBicm93c2VyIGVudmlyb25tZW50LiBUaGlzIGlzIGluaXRpYWxpc2VkIGFuZCBleHBvc2VkIHRvIGB3aW5kb3cuTWV0aXNhYCB3aGVuIHlvdSBpbXBvcnQgdGhyb3VnaCBvdXIgW2V4YW1wbGVdKC8jaW5zdGFsbGF0aW9uKS5cclxuICogQGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZVxyXG4gKi9cclxuY2xhc3MgTWV0aXNhRG9tIGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZSB7XHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgTWV0aXNhRG9tYCB3aXRoIGBvcHRzYC5cclxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHMgT3B0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gTWV0aXNhRG9tIGNvbnRydWN0b3JcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihvcHRzKSB7XHJcbiAgICBpZiAoJCA9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ01ldGlzYSBEb20gcmVxdWlyZXMgalF1ZXJ5IHRvIGJlIGF2YWlsYWJsZSEnKVxyXG4gICAgfVxyXG4gICAgc3VwZXIob3B0cyk7XHJcblxyXG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSBEb20gd2l0aCAke0pTT04uc3RyaW5naWZ5KHRoaXMub3B0cyl9IWApO1xyXG4gICAgdGhpcy5yZW5kZXJXaWRnZXQgPSB0aGlzLnJlbmRlcldpZGdldC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWdpc3Rlck9wdGlvbnMgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucy5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuYXR0YWNoUmVnaXN0ZXJPcHRpb25zVG9XaW5kb3coKTtcclxuICAgIHRoaXMucmVuZGVyV2lkZ2V0ID0gXy5vbmNlKHRoaXMucmVuZGVyV2lkZ2V0KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGFjaGVzIHJlZ2lzdGVyZWQgb3B0aW9ucyB0byBgd2luZG93Lm10YC5cclxuICAgKi9cclxuICBhdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpIHtcclxuICAgIHdpbmRvdy5tdCA9IHRoaXMucmVnaXN0ZXJPcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWBhbmQgZGV0ZXJtaW5lcyB3aGV0aGVyIGl0ZW0gb3IgYWN0aW9uIGRhdGEgc2hvdWxkIGJlIGhhbmRsZWQuXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJPcHRpb25zKCkge1xyXG4gICAgc3VwZXIucmVnaXN0ZXJPcHRpb25zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNSZWFkeVRvU3RhcnQpIHtcclxuICAgICAgdGhpcy5yZW5kZXJXaWRnZXQoKTtcclxuICAgICAgaWYgKHRoaXMuaXRlbSkge1xyXG4gICAgICAgIHRoaXMudHJhY2soJ2l0ZW0nLCB0aGlzLml0ZW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGhpcy5hY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnRyYWNrKCdhY3Rpb24nLCB0aGlzLmFjdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbmRlcnMgTWV0aXNhIHdpZGdldHMgaW4gdGhlIGJyb3dzZXIuXHJcbiAgICogT25seSBnZXRzIGNhbGxlZCBvbmNlXHJcbiAgICovXHJcbiAgcmVuZGVyV2lkZ2V0KCkge1xyXG4gICAgdGhpcy5yZW5kZXJXaWRnZXRDYWxsZWQgPSB0cnVlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIHdpZGdldHMgPSAkKCcubXQtd2lkZ2V0Jyk7XHJcblxyXG4gICAgLy8gQ29udmVydCB3aWRnZXRzIG5vZGVsaXN0IHRvIHRydWUgYXJyYXlcclxuICAgIHdpZGdldHMgPSAkLm1ha2VBcnJheSh3aWRnZXRzKTtcclxuXHJcbiAgICB3aWRnZXRzLmZvckVhY2goZnVuY3Rpb24od2lkZ2V0KSB7XHJcbiAgICAgIC8vIFJlbmRlciB3aWRnZXQgdXNpbmcgQWpheCBzbyB3ZSBjYW4gZ3JhY2VmdWxseSBkZWdyYWRlIGlmIHRoZXJlIGlzIG5vIGNvbnRlbnQgYXZhaWxhYmxlXHJcbiAgICAgIHZhciB3aWRnZXRJZCA9IHdpZGdldC5kYXRhc2V0LndpZGdldElkLFxyXG4gICAgICAgIHVzZXJJZCA9IHdpZGdldC5kYXRhc2V0LnVzZXJJZCxcclxuICAgICAgICBpdGVtSWQgPSB3aWRnZXQuZGF0YXNldC5pdGVtSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlOYW1lID0gd2lkZ2V0LmRhdGFzZXQuY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgIGJyYW5kbmFtZSA9IHdpZGdldC5kYXRhc2V0LmJyYW5kbmFtZSxcclxuICAgICAgICBzZXNzaW9uSWQgPSB3aWRnZXQuZGF0YXNldC5zZXNzaW9uSWQsXHJcbiAgICAgICAgbGFuZ3VhZ2UgPSB3aWRnZXQuZGF0YXNldC5sYW5ndWFnZSxcclxuICAgICAgICB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArICcvYXBpL3YxL3dpZGdldC1jdXN0b21lcj93aWRnZXRfaWQ9JyArIHdpZGdldElkO1xyXG5cclxuICAgICAgLy8gT3ZlcnJpZGUgdXNlciwgY2F0ZWdvcnkgb3IgYnJhbmRcclxuICAgICAgaWYgKHVzZXJJZCkgdGhpcy51c2VySWQgPSB1c2VySWQ7XHJcbiAgICAgIGlmIChpdGVtSWQpIHRoaXMuaXRlbUlkID0gaXRlbUlkO1xyXG4gICAgICBpZiAoY2F0ZWdvcnlOYW1lKSB0aGlzLmNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5TmFtZTtcclxuICAgICAgaWYgKGJyYW5kbmFtZSkgdGhpcy5icmFuZG5hbWUgPSBicmFuZG5hbWU7XHJcbiAgICAgIGlmIChzZXNzaW9uSWQpIHRoaXMuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xyXG4gICAgICBpZiAobGFuZ3VhZ2UpIHRoaXMubGFuZ3VhZ2UgPSBsYW5ndWFnZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnVzZXJJZCkge1xyXG4gICAgICAgIHVybCArPSAnJmN1c3RvbWVyX2lkPScgKyBlc2NhcGUodGhpcy51c2VySWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5pdGVtSWQpIHtcclxuICAgICAgICB1cmwgKz0gJyZwcm9kdWN0X2lkPScgKyBlc2NhcGUodGhpcy5pdGVtSWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jYXRlZ29yeU5hbWUpIHtcclxuICAgICAgICB1cmwgKz0gJyZjYXRlZ29yeV9uYW1lPScgKyBlc2NhcGUodGhpcy5jYXRlZ29yeU5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5icmFuZG5hbWUpIHtcclxuICAgICAgICB1cmwgKz0gJyZicmFuZG5hbWU9JyArIGVzY2FwZSh0aGlzLmJyYW5kbmFtZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmdlbmRlcikge1xyXG4gICAgICAgIHVybCArPSAnJmdlbmRlcj0nICsgZXNjYXBlKHRoaXMuZ2VuZGVyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuc2Vzc2lvbklkKSB7XHJcbiAgICAgICAgdXJsICs9ICcmc2Vzc2lvbl9pZD0nICsgZXNjYXBlKHRoaXMuc2Vzc2lvbklkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMubGFuZ3VhZ2UpIHtcclxuICAgICAgICB1cmwgKz0gJyZsYW5ndWFnZT0nICsgZXNjYXBlKHRoaXMubGFuZ3VhZ2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB1cmwgKz0gJyZmb3JtYXQ9aHRtbCc7XHJcbiAgICAgIC8vIFByZXBhcmUgaWZyYW1lXHJcbiAgICAgIHZhciBpZnJhbWUgPSBzZWxmLmNyZWF0ZUlGcmFtZVdpdGhJZCh3aWRnZXRJZCk7XHJcblxyXG4gICAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcclxuXHJcbiAgICAgIC8vIFJlbmRlciBsb2FkZXJcclxuICAgICAgdmFyIGh0bWwgPSBzZWxmLmdldExvYWRlckhUTUwoKTtcclxuXHJcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcclxuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoaHRtbCk7XHJcbiAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmNsb3NlKCk7XHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgfSlcclxuICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XHJcbiAgICAgICAgLy8gRGVsZXRlIGxvYWRlciBpZnJhbWVcclxuICAgICAgICB2YXIgb2xkSUZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpZGdldC0nICtcclxuICAgICAgICB3aWRnZXRJZCk7XHJcblxyXG4gICAgICAgIHZhciBpZnJhbWVQYXJlbnQgPSBvbGRJRnJhbWUucGFyZW50Tm9kZTtcclxuXHJcbiAgICAgICAgaWYgKGlmcmFtZVBhcmVudCkge1xyXG4gICAgICAgICAgd2hpbGUgKGlmcmFtZVBhcmVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIGlmcmFtZVBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWVQYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpZnJhbWUgZm9yIHdpZGdldFxyXG4gICAgICAgIHZhciBpZnJhbWUgPSBzZWxmLmNyZWF0ZUlGcmFtZVdpdGhJZCh3aWRnZXRJZCk7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XHJcblxyXG4gICAgICAgICAgdmFyIGh0bWwgPSBzZWxmLmRlY29kZUh0bWxFbnRpdGllcyhkYXRhKTtcclxuXHJcbiAgICAgICAgICBpZiAoaHRtbCkge1xyXG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XHJcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xyXG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xyXG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMzBweCc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBIdG1sIHdpbGwgYmUgZW1wdHkgaWYgc3RvcmUgaGFzIHJ1biBvdXQgb2YgZnJlZSBzYWxlcyBjcmVkaXRzLlxyXG4gICAgICAgICAgICAvLyBHcmFjZWZ1bGx5IGZhaWwgdG8gbG9hZCB3aWRnZXQgYnkgcmVtb3ZpbmcgdGhlIGlmcmFtZSBmcm9tIERPTS5cclxuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICAvLyBSZW1vdmUgaWZyYW1lIGZyb20gRE9NXHJcbiAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBTdGFydHMgdHJhY2tpbmcgYnkgc3VibWl0dGluZyBpdGVtIG9yIGFjdGlvbiBkYXRhIHRvIHRoZSBBUEkuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhdCBDYXRlZ29yeSBuYW1lIG9mIGRhdGEgKGFsbG93ZWQgdmFsdWVzOiBgXCJpdGVtXCJgLGBcImFjdGlvblwiYClcclxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBPYmplY3Qgb2YgaXRlbSBvciBhY3Rpb24gZGF0YVxyXG4gICAqL1xyXG5cclxuICB0cmFjayhjYXQsIGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0cmFja2luZyAnLCBjYXQpO1xyXG4gICAgaWYgKHRoaXMuc2x1Zykge1xyXG4gICAgICBpZiAoY2F0ID09PSAnaXRlbScpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlSXRlbShkYXRhKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChjYXQgPT09ICdhY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVPclVwZGF0ZUFjdGlvbihkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBpdGVtIGlmIGl0IGRvZXMgbm90IGV4aXN0IGluIE1ldGlzYSBvciB1cGRhdGVzIHRoZSBpdGVtLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtRGF0YSBbaXRlbURhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjSXRlbS1kYXRhfSBvYmplY3QgdG8gYmUgc3VibWl0dGVkIHRvIHRoZSBpdGVtIEFQSSBlbmRwb2ludFxyXG4gICAqL1xyXG4gIGNyZWF0ZU9yVXBkYXRlSXRlbShkYXRhKSB7XHJcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMuaXRlbUVuZHBvaW50O1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHhociwgc2V0dGluZ3MpIHtcclxuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICB9LFxyXG4gICAgICBzdGF0dXNDb2RlOiB7XHJcbiAgICAgICAgICA1MDA6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgeGhyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnJlc3BvbnNlSlNPTik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBhY3Rpb24gaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIGFjdGlvbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uRGF0YSBbYWN0aW9uRGF0YV17QGxpbmsgQlJPV1NFUi9TQ0hFTUEuaHRtbCNBY3Rpb24tZGF0YX0gb2JqZWN0IHRvIGJlIHN1Ym1pdHRlZCB0byB0aGUgYWN0aW9uIEFQSSBlbmRwb2ludFxyXG4gICAqL1xyXG4gIGNyZWF0ZU9yVXBkYXRlQWN0aW9uKGRhdGEpIHtcclxuICAgIHZhciB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArIHRoaXMub3B0cy5hY3Rpb25FbmRwb2ludDtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgfSxcclxuICAgICAgc3RhdHVzQ29kZToge1xyXG4gICAgICAgICAgNTAwOiBmdW5jdGlvbihkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW50ZXJuYWwgc2VydmVyIGVycm9yJyk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIHhocik7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5yZXNwb25zZUpTT04pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdyaXRlcyBsb2dzIGFib3V0IHJlZ2lzdGVyZWQgb3B0aW9ucyB0byBicm93c2VyIGNvbnNvbGUgd2hlbiBgZGVidWdgIHByb3BlcnR5IG9mIGBNZXRpc2FEb21gIG9iamVjdCBpcyBgdHJ1ZWBcclxuICAgKi9cclxuICBsb2coKSB7XHJcbiAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICBjb25zb2xlLmxvZy5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGlzYURvbTtcclxuIiwiLyoqXHJcbiAqIFJldHVybnMge0BsaW5rIGNvbXBvc2VDbGFzcy5JRnJhbWV9IGNvbXBvc2VkIHdpdGggYGNvbXBvc2VkQ2xhc3NgLlxyXG4gKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0gIHtjbGFzc30gY29tcG9zZWRDbGFzcyBgY29tcG9zZWRDbGFzc2AgdG8gYmUgY29tcG9zZWQuXHJcbiAqIEByZXR1cm5zIHtjb21wb3NlQ2xhc3MuSUZyYW1lfVxyXG4gKi9cclxuXHJcbnZhciBjb21wb3NlQ2xhc3MgPSBmdW5jdGlvbihjb21wb3NlZENsYXNzKSB7XHJcbiAgLyoqXHJcbiAgICogYDxpZnJhbWU+YCBlbGVtZW50IGluIHRoZSByZWNvbW1lbmRhdGlvbiB3aWRnZXQuXHJcbiAgICogQHR5cGVkZWYge09iamVjdH0gSUZyYW1lXHJcbiAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzc1xyXG4gICAqL1xyXG4gIHJldHVybiBjbGFzcyBJRnJhbWUgZXh0ZW5kcyBjb21wb3NlZENsYXNzIHtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBgaWZyYW1lYCBlbGVtZW50XHJcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFJlY29tbWVuZGF0aW9uIHdpZGdldCBJRFxyXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVJRnJhbWVXaXRoSWQoaWQpIHtcclxuICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG5cclxuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnYm9yZGVyOiAwcHg7IHdpZHRoOiAxMDAlOycpO1xyXG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdmcmFtZWJvcmRlcicsICcwJyk7XHJcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3Njcm9sbGluZycsICdubycpO1xyXG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdvbmxvYWQnLCAnd2luZG93Lk1ldGlzYS5yZXNpemVJZnJhbWUodGhpcyknKTtcclxuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2lkZ2V0LScgKyBpZCk7XHJcblxyXG4gICAgICByZXR1cm4gaWZyYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzaXplcyBgaWZyYW1lYCBlbGVtZW50XHJcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIGBpZnJhbWVgIGVsZW1lbnQgdG8gYmUgcmVzaXplZC5cclxuICAgICAqL1xyXG4gICAgcmVzaXplSWZyYW1lKG9iaikge1xyXG4gICAgICBvYmouc3R5bGUuaGVpZ2h0ID0gMDtcclxuICAgICAgb2JqLnN0eWxlLmhlaWdodCA9IG9iai5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbG9hZGVyIEhUTUxcclxuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXRMb2FkZXJIVE1MKCkge1xyXG4gICAgICByZXR1cm4gJzwhZG9jdHlwZSBodG1sPjxodG1sPjxzdHlsZT5ib2R5e2hlaWdodDogMTAwcHg7fS5jcy1sb2FkZXJ7aGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTt9LmNzLWxvYWRlci1pbm5lcnt0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7IHRvcDogNTAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiBjYWxjKDEwMCUgLSAyMDBweCk7IGNvbG9yOiAjQTJBM0EzOyBwYWRkaW5nOiAwIDEwMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWx7Zm9udC1zaXplOiAyMHB4OyBvcGFjaXR5OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fUBrZXlmcmFtZXMgbG9sezAle29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9MTAwJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319QC13ZWJraXQta2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9NjYle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNil7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDUpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg0KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMyl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDIpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgNDAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgxKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9PC9zdHlsZT48Ym9keT4gPGRpdiBjbGFzcz1cImNzLWxvYWRlclwiPiA8ZGl2IGNsYXNzPVwiY3MtbG9hZGVyLWlubmVyXCI+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+JztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgZGVjb2RlZCBIVE1MIGVudGl0aWVzXHJcbiAgICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzLklGcmFtZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBIVE1MIGVudGl0aWVzXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBkZWNvZGVIdG1sRW50aXRpZXMoc3RyKSB7XHJcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvJiM/KFxcdyspOy9nLCBmdW5jdGlvbihtYXRjaCwgZGVjKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGRlYykpIHtcclxuICAgICAgICAgIHZhciBjaGFycyA9IHtcclxuICAgICAgICAgICAgcXVvdDogMzQsXHJcbiAgICAgICAgICAgIGFtcDogMzgsXHJcbiAgICAgICAgICAgIGx0OiA2MCxcclxuICAgICAgICAgICAgZ3Q6IDYyLFxyXG4gICAgICAgICAgICBuYnNwOiAxNjAsXHJcbiAgICAgICAgICAgIGNvcHk6IDE2OSxcclxuICAgICAgICAgICAgcmVnOiAxNzQsXHJcbiAgICAgICAgICAgIGRlZzogMTc2LFxyXG4gICAgICAgICAgICBmcmFzbDogNDcsXHJcbiAgICAgICAgICAgIHRyYWRlOiA4NDgyLFxyXG4gICAgICAgICAgICBldXJvOiA4MzY0LFxyXG4gICAgICAgICAgICBBZ3JhdmU6IDE5MixcclxuICAgICAgICAgICAgQWFjdXRlOiAxOTMsXHJcbiAgICAgICAgICAgIEFjaXJjOiAxOTQsXHJcbiAgICAgICAgICAgIEF0aWxkZTogMTk1LFxyXG4gICAgICAgICAgICBBdW1sOiAxOTYsXHJcbiAgICAgICAgICAgIEFyaW5nOiAxOTcsXHJcbiAgICAgICAgICAgIEFFbGlnOiAxOTgsXHJcbiAgICAgICAgICAgIENjZWRpbDogMTk5LFxyXG4gICAgICAgICAgICBFZ3JhdmU6IDIwMCxcclxuICAgICAgICAgICAgRWFjdXRlOiAyMDEsXHJcbiAgICAgICAgICAgIEVjaXJjOiAyMDIsXHJcbiAgICAgICAgICAgIEV1bWw6IDIwMyxcclxuICAgICAgICAgICAgSWdyYXZlOiAyMDQsXHJcbiAgICAgICAgICAgIElhY3V0ZTogMjA1LFxyXG4gICAgICAgICAgICBJY2lyYzogMjA2LFxyXG4gICAgICAgICAgICBJdW1sOiAyMDcsXHJcbiAgICAgICAgICAgIEVUSDogMjA4LFxyXG4gICAgICAgICAgICBOdGlsZGU6IDIwOSxcclxuICAgICAgICAgICAgT2dyYXZlOiAyMTAsXHJcbiAgICAgICAgICAgIE9hY3V0ZTogMjExLFxyXG4gICAgICAgICAgICBPY2lyYzogMjEyLFxyXG4gICAgICAgICAgICBPdGlsZGU6IDIxMyxcclxuICAgICAgICAgICAgT3VtbDogMjE0LFxyXG4gICAgICAgICAgICB0aW1lczogMjE1LFxyXG4gICAgICAgICAgICBPc2xhc2g6IDIxNixcclxuICAgICAgICAgICAgVWdyYXZlOiAyMTcsXHJcbiAgICAgICAgICAgIFVhY3V0ZTogMjE4LFxyXG4gICAgICAgICAgICBVY2lyYzogMjE5LFxyXG4gICAgICAgICAgICBVdW1sOiAyMjAsXHJcbiAgICAgICAgICAgIFlhY3V0ZTogMjIxLFxyXG4gICAgICAgICAgICBUSE9STjogMjIyLFxyXG4gICAgICAgICAgICBzemxpZzogMjIzLFxyXG4gICAgICAgICAgICBhZ3JhdmU6IDIyNCxcclxuICAgICAgICAgICAgYWFjdXRlOiAyMjUsXHJcbiAgICAgICAgICAgIGFjaXJjOiAyMjYsXHJcbiAgICAgICAgICAgIGF0aWxkZTogMjI3LFxyXG4gICAgICAgICAgICBhdW1sOiAyMjgsXHJcbiAgICAgICAgICAgIGFyaW5nOiAyMjksXHJcbiAgICAgICAgICAgIGFlbGlnOiAyMzAsXHJcbiAgICAgICAgICAgIGNjZWRpbDogMjMxLFxyXG4gICAgICAgICAgICBlZ3JhdmU6IDIzMixcclxuICAgICAgICAgICAgZWFjdXRlOiAyMzMsXHJcbiAgICAgICAgICAgIGVjaXJjOiAyMzQsXHJcbiAgICAgICAgICAgIGV1bWw6IDIzNSxcclxuICAgICAgICAgICAgaWdyYXZlOiAyMzYsXHJcbiAgICAgICAgICAgIGlhY3V0ZTogMjM3LFxyXG4gICAgICAgICAgICBpY2lyYzogMjM4LFxyXG4gICAgICAgICAgICBpdW1sOiAyMzksXHJcbiAgICAgICAgICAgIGV0aDogMjQwLFxyXG4gICAgICAgICAgICBudGlsZGU6IDI0MSxcclxuICAgICAgICAgICAgb2dyYXZlOiAyNDIsXHJcbiAgICAgICAgICAgIG9hY3V0ZTogMjQzLFxyXG4gICAgICAgICAgICBvY2lyYzogMjQ0LFxyXG4gICAgICAgICAgICBvdGlsZGU6IDI0NSxcclxuICAgICAgICAgICAgb3VtbDogMjQ2LFxyXG4gICAgICAgICAgICBkaXZpZGU6IDI0NyxcclxuICAgICAgICAgICAgb3NsYXNoOiAyNDgsXHJcbiAgICAgICAgICAgIHVncmF2ZTogMjQ5LFxyXG4gICAgICAgICAgICB1YWN1dGU6IDI1MCxcclxuICAgICAgICAgICAgdWNpcmM6IDI1MSxcclxuICAgICAgICAgICAgdXVtbDogMjUyLFxyXG4gICAgICAgICAgICB5YWN1dGU6IDI1MyxcclxuICAgICAgICAgICAgdGhvcm46IDI1NCxcclxuICAgICAgICAgICAgeXVtbDogMjU1LFxyXG4gICAgICAgICAgICBsc3F1bzogODIxNixcclxuICAgICAgICAgICAgcnNxdW86IDgyMTcsXHJcbiAgICAgICAgICAgIHNicXVvOiA4MjE4LFxyXG4gICAgICAgICAgICBsZHF1bzogODIyMCxcclxuICAgICAgICAgICAgcmRxdW86IDgyMjEsXHJcbiAgICAgICAgICAgIGJkcXVvOiA4MjIyLFxyXG4gICAgICAgICAgICBkYWdnZXI6IDgyMjQsXHJcbiAgICAgICAgICAgIERhZ2dlcjogODIyNSxcclxuICAgICAgICAgICAgcGVybWlsOiA4MjQwLFxyXG4gICAgICAgICAgICBsc2FxdW86IDgyNDksXHJcbiAgICAgICAgICAgIHJzYXF1bzogODI1MCxcclxuICAgICAgICAgICAgc3BhZGVzOiA5ODI0LFxyXG4gICAgICAgICAgICBjbHViczogOTgyNyxcclxuICAgICAgICAgICAgaGVhcnRzOiA5ODI5LFxyXG4gICAgICAgICAgICBkaWFtczogOTgzMCxcclxuICAgICAgICAgICAgb2xpbmU6IDgyNTQsXHJcbiAgICAgICAgICAgIGxhcnI6IDg1OTIsXHJcbiAgICAgICAgICAgIHVhcnI6IDg1OTMsXHJcbiAgICAgICAgICAgIHJhcnI6IDg1OTQsXHJcbiAgICAgICAgICAgIGRhcnI6IDg1OTUsXHJcbiAgICAgICAgICAgIGhlbGxpcDogMTMzLFxyXG4gICAgICAgICAgICBuZGFzaDogMTUwLFxyXG4gICAgICAgICAgICBtZGFzaDogMTUxLFxyXG4gICAgICAgICAgICBpZXhjbDogMTYxLFxyXG4gICAgICAgICAgICBjZW50OiAxNjIsXHJcbiAgICAgICAgICAgIHBvdW5kOiAxNjMsXHJcbiAgICAgICAgICAgIGN1cnJlbjogMTY0LFxyXG4gICAgICAgICAgICB5ZW46IDE2NSxcclxuICAgICAgICAgICAgYnJ2YmFyOiAxNjYsXHJcbiAgICAgICAgICAgIGJya2JhcjogMTY2LFxyXG4gICAgICAgICAgICBzZWN0OiAxNjcsXHJcbiAgICAgICAgICAgIHVtbDogMTY4LFxyXG4gICAgICAgICAgICBkaWU6IDE2OCxcclxuICAgICAgICAgICAgb3JkZjogMTcwLFxyXG4gICAgICAgICAgICBsYXF1bzogMTcxLFxyXG4gICAgICAgICAgICBub3Q6IDE3MixcclxuICAgICAgICAgICAgc2h5OiAxNzMsXHJcbiAgICAgICAgICAgIG1hY3I6IDE3NSxcclxuICAgICAgICAgICAgaGliYXI6IDE3NSxcclxuICAgICAgICAgICAgcGx1c21uOiAxNzcsXHJcbiAgICAgICAgICAgIHN1cDI6IDE3OCxcclxuICAgICAgICAgICAgc3VwMzogMTc5LFxyXG4gICAgICAgICAgICBhY3V0ZTogMTgwLFxyXG4gICAgICAgICAgICBtaWNybzogMTgxLFxyXG4gICAgICAgICAgICBwYXJhOiAxODIsXHJcbiAgICAgICAgICAgIG1pZGRvdDogMTgzLFxyXG4gICAgICAgICAgICBjZWRpbDogMTg0LFxyXG4gICAgICAgICAgICBzdXAxOiAxODUsXHJcbiAgICAgICAgICAgIG9yZG06IDE4NixcclxuICAgICAgICAgICAgcmFxdW86IDE4NyxcclxuICAgICAgICAgICAgZnJhYzE0OiAxODgsXHJcbiAgICAgICAgICAgIGZyYWMxMjogMTg5LFxyXG4gICAgICAgICAgICBmcmFjMzQ6IDE5MCxcclxuICAgICAgICAgICAgaXF1ZXN0OiAxOTEsXHJcbiAgICAgICAgICAgIEFscGhhOiA5MTMsXHJcbiAgICAgICAgICAgIGFscGhhOiA5NDUsXHJcbiAgICAgICAgICAgIEJldGE6IDkxNCxcclxuICAgICAgICAgICAgYmV0YTogOTQ2LFxyXG4gICAgICAgICAgICBHYW1tYTogOTE1LFxyXG4gICAgICAgICAgICBnYW1tYTogOTQ3LFxyXG4gICAgICAgICAgICBEZWx0YTogOTE2LFxyXG4gICAgICAgICAgICBkZWx0YTogOTQ4LFxyXG4gICAgICAgICAgICBFcHNpbG9uOiA5MTcsXHJcbiAgICAgICAgICAgIGVwc2lsb246IDk0OSxcclxuICAgICAgICAgICAgWmV0YTogOTE4LFxyXG4gICAgICAgICAgICB6ZXRhOiA5NTAsXHJcbiAgICAgICAgICAgIEV0YTogOTE5LFxyXG4gICAgICAgICAgICBldGE6IDk1MSxcclxuICAgICAgICAgICAgVGhldGE6IDkyMCxcclxuICAgICAgICAgICAgdGhldGE6IDk1MixcclxuICAgICAgICAgICAgSW90YTogOTIxLFxyXG4gICAgICAgICAgICBpb3RhOiA5NTMsXHJcbiAgICAgICAgICAgIEthcHBhOiA5MjIsXHJcbiAgICAgICAgICAgIGthcHBhOiA5NTQsXHJcbiAgICAgICAgICAgIExhbWJkYTogOTIzLFxyXG4gICAgICAgICAgICBsYW1iZGE6IDk1NSxcclxuICAgICAgICAgICAgTXU6IDkyNCxcclxuICAgICAgICAgICAgbXU6IDk1NixcclxuICAgICAgICAgICAgTnU6IDkyNSxcclxuICAgICAgICAgICAgbnU6IDk1NyxcclxuICAgICAgICAgICAgWGk6IDkyNixcclxuICAgICAgICAgICAgeGk6IDk1OCxcclxuICAgICAgICAgICAgT21pY3JvbjogOTI3LFxyXG4gICAgICAgICAgICBvbWljcm9uOiA5NTksXHJcbiAgICAgICAgICAgIFBpOiA5MjgsXHJcbiAgICAgICAgICAgIHBpOiA5NjAsXHJcbiAgICAgICAgICAgIFJobzogOTI5LFxyXG4gICAgICAgICAgICByaG86IDk2MSxcclxuICAgICAgICAgICAgU2lnbWE6IDkzMSxcclxuICAgICAgICAgICAgc2lnbWE6IDk2MyxcclxuICAgICAgICAgICAgVGF1OiA5MzIsXHJcbiAgICAgICAgICAgIHRhdTogOTY0LFxyXG4gICAgICAgICAgICBVcHNpbG9uOiA5MzMsXHJcbiAgICAgICAgICAgIHVwc2lsb246IDk2NSxcclxuICAgICAgICAgICAgUGhpOiA5MzQsXHJcbiAgICAgICAgICAgIHBoaTogOTY2LFxyXG4gICAgICAgICAgICBDaGk6IDkzNSxcclxuICAgICAgICAgICAgY2hpOiA5NjcsXHJcbiAgICAgICAgICAgIFBzaTogOTM2LFxyXG4gICAgICAgICAgICBwc2k6IDk2OCxcclxuICAgICAgICAgICAgT21lZ2E6IDkzNyxcclxuICAgICAgICAgICAgb21lZ2E6IDk2OVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBpZiAoY2hhcnNbZGVjXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGRlYyA9IGNoYXJzW2RlY107XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGRlYyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2VDbGFzcztcclxuIiwiY29uc3QgTWV0aXNhRG9tID0gcmVxdWlyZSgnLi9NZXRpc2EvZG9tJyk7XHJcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcclxuXHJcblxyXG4vKipcclxuICogTG9hZHMgalF1ZXJ5IGFuZCB7QGxpbmsgTWV0aXNhRG9tfSBvYmplY3QgaW50byB3aW5kb3cgb2JqZWN0IGluIGJyb3dzZXJcclxuICogQHByaXZhdGVcclxuICogQHJlcXVpcmVzIE1ldGlzYURvbVxyXG4gKiBAcmVxdWlyZXMgZ2V0VXRpbFxyXG4gKi9cclxuZnVuY3Rpb24gYnJvd3NlcigpIHtcclxuICBpZiAodXRpbC5lbnZpcm9ubWVudCAhPT0gJ2Jyb3dzZXInICkge1xyXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybignTWV0aXNhIGJyb3dzZXIgY2FuIG9ubHkgcnVuIGluc2lkZSBhIGJyb3dzZXInKTtcclxuICB9XHJcbiAgd2luZG93LmpRdWVyeSA9IHdpbmRvdy4kID0gJCB8fCBqUXVlcnkgfHwge307XHJcblxyXG4gIHdpbmRvdy5NZXRpc2EgPSBuZXcgTWV0aXNhRG9tKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGJyb3dzZXIpKCk7XHJcbiIsIi8qKlxyXG4gKiBHZXRzIFNESyB1dGlsaXRpZXNcclxuICpcclxuICogQHByaXZhdGVcclxuICogQHJldHVybnMge1V0aWxPYmp9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRVdGlsKCkge1xyXG4gIC8qKlxyXG4gICAqIE9iamVjdCBjb250YWluaW5nIHV0aWxpbGl0aWVzXHJcbiAgICogQHR5cGVkZWYge09iamVjdH0gVXRpbE9ialxyXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbnZpcm9ubWVudCBFbnZpcm9ubWVudCB0aGF0IE1ldGlzYSBvYmplY3QgaXMgZXhwb3NlZCB0by4gUmV0dXJucyBgJ2Jyb3dzZXInYCBvciBgbm9kZWAuXHJcbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gY29tcG9zZSBbRnVuY3Rpb25dKCNHZXRVdGlsLWNvbXBvc2VGdW5jKSBmb3IgY29tcG9zaW5nIGNsYXNzZXNcclxuICAgKiBAbWVtYmVyb2YgZ2V0VXRpbFxyXG4gICAqL1xyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBjb21wb3NlZCBjbGFzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSAge2NsYXNzfSBvcmlnaW5hbCBDbGFzcyB0byBiZSBjb21wb3NlZCB0by5cclxuICAgKiBAcmV0dXJuIHtjbGFzc31cclxuICAgKi9cclxuICB2YXIgY29tcG9zZUZ1bmMgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zdCBjb21wb3NpdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgICB2YXIgY29tcG9zZWQgPSBvcmlnaW5hbDtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb21wb3NlZCA9IGNvbXBvc2l0aW9uc1tpXShjb21wb3NlZCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbXBvc2VkO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgcmV0dXJuIHtcclxuICAgIGVudmlyb25tZW50OiB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/ICdicm93c2VyJyA6ICdub2RlJyxcclxuICAgIGNvbXBvc2U6IGNvbXBvc2VGdW5jLFxyXG4gIH07XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSAoZ2V0VXRpbCkoKTtcclxuIl19
