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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvYmVmb3JlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvb25jZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9GaW5pdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJzcmMvTWV0aXNhL2NvcmUvaW5kZXguanMiLCJzcmMvTWV0aXNhL2RvbS9pbmRleC5qcyIsInNyYy9NZXRpc2EvZG9tL3dpdGhJRnJhbWUuanMiLCJzcmMvYnJvd3Nlci5qcyIsInNyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gKiBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hpbGUgaXQncyBjYWxsZWQgbGVzcyB0aGFuIGBuYCB0aW1lcy4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGNhbGxzIGF0IHdoaWNoIGBmdW5jYCBpcyBubyBsb25nZXIgaW52b2tlZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcmVzdHJpY3RlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uYmVmb3JlKDUsIGFkZENvbnRhY3RUb0xpc3QpKTtcbiAqIC8vID0+IEFsbG93cyBhZGRpbmcgdXAgdG8gNCBjb250YWN0cyB0byB0aGUgbGlzdC5cbiAqL1xuZnVuY3Rpb24gYmVmb3JlKG4sIGZ1bmMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgbiA9IHRvSW50ZWdlcihuKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICgtLW4gPiAwKSB7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGlmIChuIDw9IDEpIHtcbiAgICAgIGZ1bmMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVmb3JlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgYmVmb3JlID0gcmVxdWlyZSgnLi9iZWZvcmUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGludm9raW5nIGBmdW5jYCBvbmNlLiBSZXBlYXQgY2FsbHNcbiAqIHRvIHRoZSBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnZvY2F0aW9uLiBUaGUgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBpbml0aWFsaXplID0gXy5vbmNlKGNyZWF0ZUFwcGxpY2F0aW9uKTtcbiAqIGluaXRpYWxpemUoKTtcbiAqIGluaXRpYWxpemUoKTtcbiAqIC8vID0+IGBjcmVhdGVBcHBsaWNhdGlvbmAgaXMgaW52b2tlZCBvbmNlXG4gKi9cbmZ1bmN0aW9uIG9uY2UoZnVuYykge1xuICByZXR1cm4gYmVmb3JlKDIsIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uY2U7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgZmluaXRlIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTIuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvRmluaXRlKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b0Zpbml0ZShJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9GaW5pdGUoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gdmFsdWUgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRmluaXRlO1xuIiwidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwiLyoqXG4gKiBPcHRpb25zIG9iamVjdCBkZWZpbml0aW9uXG4gKiBAcHJpdmF0ZVxuICogQHR5cGVkZWYge09iamVjdH0gT3B0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGJhc2VVcmw9aHR0cHM6Ly9hc2ttZXRpc2EuY29tLyBCYXNlIFVSTCBvZiBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpdGVtRW5kcG9pbnQ9L2FwaS92MS9wcm9kdWN0LWNvbGxlY3Rpb24gUGF0aCBvZiBBUEkgZW5kcG9pbnQgZm9yIGNyZWF0aW5nIG9yIHVwZGF0aW5nIGl0ZW1zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYWN0aW9uRW5kcG9pbnQ9L2FwaS92MS9vcmRlci10cmFuc2FjdGlvbiBQYXRoIG9mIEFQSSBlbmRwb2ludCBmb3IgY3JlYXRpbmcgb3IgdXBkYXRpbmcgYWN0aW9uc1xuICovXG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciBhbnkgZW52aXJvbm1lbnQuXG5cbiAqL1xuY2xhc3MgTWV0aXNhIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYE1ldGlzYWAgd2l0aCBgb3B0c2AuXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0cyBPcHRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2EgY29udHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIGJhc2VVcmw6ICdodHRwczovL2Fza21ldGlzYS5jb20vJyxcbiAgICAgICAgaXRlbUVuZHBvaW50OiBcIi9hcGkvdjEvcHJvZHVjdC1jb2xsZWN0aW9uXCIsXG4gICAgICAgIGFjdGlvbkVuZHBvaW50OiBcIi9hcGkvdjEvb3JkZXItdHJhbnNhY3Rpb25cIixcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHdyaXRlIGxvZ3MgaW4gYnJvd3NlciBjb25zb2xlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgY29uc29sZS5sb2coYGluaXRpYWxpc2VkIE1ldGlzYSB3aXRoICR7SlNPTi5zdHJpbmdpZnkodGhpcy5vcHRzKX0hYCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgcmVhZHkgdG8gc3RhcnQgY2FsbGluZyBBUEkuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGlzUmVhZHlUb1N0YXJ0KCkge1xuICAgIHZhciBpc1JlYWR5ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIG9wdGlvbnMgZnJvbSBgbXQoJ3t7IG9wdGlvbiB9fScsIHt7IHZhbHVlIH19KWAuXG4gICAqL1xuICByZWdpc3Rlck9wdGlvbnMoKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2Jhc2VVcmwnKSB7XG4gICAgICAvLyBJbml0IEJhc2UgVVJMIGZvciB0ZXN0aW5nXG4gICAgICB0aGlzLmxvZygnQmFzZSBVUkwgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5vcHRzLmJhc2VVcmwgPSBhcmd1bWVudHNbMV07IC8vIG92ZXJyaWRlXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdpdGVtJykge1xuICAgICAgLy8gSW5pdCBJdGVtIG9iamVjdFxuICAgICAgdGhpcy5sb2coJ0l0ZW0gaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5pdGVtID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnYWN0aW9uJykge1xuICAgICAgLy8gSW5pdCBBY3Rpb24gb2JqZWN0XG4gICAgICB0aGlzLmxvZygnQWN0aW9uIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMuYWN0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnc2x1ZycpIHtcbiAgICAgIC8vIEluaXQgc3RvcmUgc2x1Z1xuICAgICAgdGhpcy5sb2coJ1N0b3JlIHNsdWcgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5zbHVnID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAndXNlcicpIHtcbiAgICAgIC8vIEluaXQgdXNlciBiYXNlZCByZWNvbW1lbmRhdGlvbnNcbiAgICAgIHRoaXMubG9nKCdVc2VyIElEIGlzJywgYXJndW1lbnRzWzFdKTtcbiAgICAgIHRoaXMudXNlcklkID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzWzBdID09PSAnY2F0ZWdvcnknKSB7XG4gICAgICAvLyBJbml0IGNhdGVnb3J5XG4gICAgICB0aGlzLmxvZygnQ2F0ZWdvcnkgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5jYXRlZ29yeU5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdicmFuZCcpIHtcbiAgICAgIC8vIEluaXQgYnJhbmRcbiAgICAgIHRoaXMubG9nKCdCcmFuZCBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmJyYW5kbmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ2l0ZW1JZCcpIHtcbiAgICAgIC8vIEluaXQgaXRlbSBpZFxuICAgICAgdGhpcy5sb2coJ0l0ZW0gSUQgaXMnLCBhcmd1bWVudHNbMV0pO1xuICAgICAgdGhpcy5pdGVtSWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdnZW5kZXInKSB7XG4gICAgICAvLyBJbml0IGdlbmRlclxuICAgICAgdGhpcy5sb2coJ0dlbmRlciBpcycsIGFyZ3VtZW50c1sxXSk7XG4gICAgICB0aGlzLmdlbmRlciA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50c1swXSA9PT0gJ3Nlc3Npb24nKSB7XG4gICAgICAvLyBJbml0IHNlc3Npb25cbiAgICAgIHRoaXMubG9nKCdTZXNzaW9uIGlzJywgYXJndW1lbnRzWzFdKVxuICAgICAgdGhpcy5zZXNzaW9uSWQgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHNbMF0gPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMubG9nKCdMYW5ndWFnZSBpcycsIGFyZ3VtZW50c1sxXSlcbiAgICAgIHRoaXMubGFuZ3VhZ2UgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNZXRpc2E7XG4iLCJ2YXIgTWV0aXNhQ29yZSA9IHJlcXVpcmUoJy4uL2NvcmUnKTtcbnZhciB3aXRoSUZyYW1lID0gcmVxdWlyZSgnLi93aXRoSUZyYW1lJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcbnZhciBfID0ge1xuICBvbmNlOiByZXF1aXJlKCdsb2Rhc2gvb25jZScpXG59O1xudmFyIGNvbXBvc2UgPSB1dGlsLmNvbXBvc2U7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyB7QGxpbmsgTWV0aXNhfSBjbGFzcyB0aGF0IGNvbXBvc2VzIHdpdGgge0BsaW5rIGNvbXBvc2VDbGFzcy5JRnJhbWV9XG4gKiBAcmVxdWlyZXMgTWV0aXNhXG4gKiBAcmVxdWlyZXMgY29tcG9zZUNsYXNzXG4gKiBAcmVxdWlyZXMgZ2V0VXRpbC5jb21wb3NlXG4gKi9cbnZhciBNZXRpc2F3aXRoSUZyYW1lID0gY29tcG9zZShNZXRpc2FDb3JlKSh3aXRoSUZyYW1lKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEJhc2UgY2xhc3MgZm9yIGJyb3dzZXIgZW52aXJvbm1lbnQuIFRoaXMgaXMgaW5pdGlhbGlzZWQgYW5kIGV4cG9zZWQgdG8gYHdpbmRvdy5NZXRpc2FgIHdoZW4geW91IGltcG9ydCB0aHJvdWdoIG91ciBbZXhhbXBsZV0oLyNpbnN0YWxsYXRpb24pLlxuICogQGV4dGVuZHMgTWV0aXNhd2l0aElGcmFtZVxuICovXG5jbGFzcyBNZXRpc2FEb20gZXh0ZW5kcyBNZXRpc2F3aXRoSUZyYW1lIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYE1ldGlzYURvbWAgd2l0aCBgb3B0c2AuXG4gICAqIEBwYXJhbSB7T3B0c30gb3B0cyBPcHRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBNZXRpc2FEb20gY29udHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIGlmICgkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ01ldGlzYSBEb20gcmVxdWlyZXMgalF1ZXJ5IHRvIGJlIGF2YWlsYWJsZSEnKVxuICAgIH1cbiAgICBzdXBlcihvcHRzKTtcblxuICAgIGNvbnNvbGUubG9nKGBpbml0aWFsaXNlZCBNZXRpc2EgRG9tIHdpdGggJHtKU09OLnN0cmluZ2lmeSh0aGlzLm9wdHMpfSFgKTtcbiAgICB0aGlzLnJlbmRlcldpZGdldCA9IHRoaXMucmVuZGVyV2lkZ2V0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWdpc3Rlck9wdGlvbnMgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5hdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpO1xuICAgIHRoaXMucmVuZGVyV2lkZ2V0ID0gXy5vbmNlKHRoaXMucmVuZGVyV2lkZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyByZWdpc3RlcmVkIG9wdGlvbnMgdG8gYHdpbmRvdy5tdGAuXG4gICAqL1xuICBhdHRhY2hSZWdpc3Rlck9wdGlvbnNUb1dpbmRvdygpIHtcbiAgICB3aW5kb3cubXQgPSB0aGlzLnJlZ2lzdGVyT3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgb3B0aW9ucyBmcm9tIGBtdCgne3sgb3B0aW9uIH19Jywge3sgdmFsdWUgfX0pYGFuZCBkZXRlcm1pbmVzIHdoZXRoZXIgaXRlbSBvciBhY3Rpb24gZGF0YSBzaG91bGQgYmUgaGFuZGxlZC5cbiAgICovXG4gIHJlZ2lzdGVyT3B0aW9ucygpIHtcbiAgICBzdXBlci5yZWdpc3Rlck9wdGlvbnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGlmICh0aGlzLmlzUmVhZHlUb1N0YXJ0KSB7XG4gICAgICB0aGlzLnJlbmRlcldpZGdldCgpO1xuICAgICAgaWYgKHRoaXMuaXRlbSkge1xuICAgICAgICB0aGlzLnRyYWNrKCdpdGVtJywgdGhpcy5pdGVtKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5hY3Rpb24pIHtcbiAgICAgICAgdGhpcy50cmFjaygnYWN0aW9uJywgdGhpcy5hY3Rpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIE1ldGlzYSB3aWRnZXRzIGluIHRoZSBicm93c2VyLlxuICAgKiBPbmx5IGdldHMgY2FsbGVkIG9uY2VcbiAgICovXG4gIHJlbmRlcldpZGdldCgpIHtcbiAgICB0aGlzLnJlbmRlcldpZGdldENhbGxlZCA9IHRydWU7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICB3aWRnZXRzID0gJCgnLm10LXdpZGdldCcpO1xuXG4gICAgLy8gQ29udmVydCB3aWRnZXRzIG5vZGVsaXN0IHRvIHRydWUgYXJyYXlcbiAgICB3aWRnZXRzID0gJC5tYWtlQXJyYXkod2lkZ2V0cyk7XG5cbiAgICB3aWRnZXRzLmZvckVhY2goZnVuY3Rpb24od2lkZ2V0KSB7XG4gICAgICAvLyBSZW5kZXIgd2lkZ2V0IHVzaW5nIEFqYXggc28gd2UgY2FuIGdyYWNlZnVsbHkgZGVncmFkZSBpZiB0aGVyZSBpcyBubyBjb250ZW50IGF2YWlsYWJsZVxuICAgICAgdmFyIHdpZGdldElkID0gd2lkZ2V0LmRhdGFzZXQud2lkZ2V0SWQsXG4gICAgICAgIHVzZXJJZCA9IHdpZGdldC5kYXRhc2V0LnVzZXJJZCxcbiAgICAgICAgaXRlbUlkID0gd2lkZ2V0LmRhdGFzZXQuaXRlbUlkLFxuICAgICAgICBjYXRlZ29yeU5hbWUgPSB3aWRnZXQuZGF0YXNldC5jYXRlZ29yeU5hbWUsXG4gICAgICAgIGJyYW5kbmFtZSA9IHdpZGdldC5kYXRhc2V0LmJyYW5kbmFtZSxcbiAgICAgICAgc2Vzc2lvbklkID0gd2lkZ2V0LmRhdGFzZXQuc2Vzc2lvbklkLFxuICAgICAgICBsYW5ndWFnZSA9IHdpZGdldC5kYXRhc2V0Lmxhbmd1YWdlLFxuICAgICAgICB1cmwgPSB0aGlzLm9wdHMuYmFzZVVybCArIHRoaXMuc2x1ZyArICcvYXBpL3YxL3dpZGdldC1jdXN0b21lcj93aWRnZXRfaWQ9JyArIHdpZGdldElkO1xuXG4gICAgICAvLyBPdmVycmlkZSB1c2VyLCBjYXRlZ29yeSBvciBicmFuZFxuICAgICAgaWYgKHVzZXJJZCkgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgICBpZiAoaXRlbUlkKSB0aGlzLml0ZW1JZCA9IGl0ZW1JZDtcbiAgICAgIGlmIChjYXRlZ29yeU5hbWUpIHRoaXMuY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnlOYW1lO1xuICAgICAgaWYgKGJyYW5kbmFtZSkgdGhpcy5icmFuZG5hbWUgPSBicmFuZG5hbWU7XG4gICAgICBpZiAoc2Vzc2lvbklkKSB0aGlzLnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICAgIGlmIChsYW5ndWFnZSkgdGhpcy5sYW5ndWFnZSA9IGxhbmd1YWdlO1xuXG4gICAgICBpZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgdXJsICs9ICcmY3VzdG9tZXJfaWQ9JyArIGVzY2FwZSh0aGlzLnVzZXJJZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLml0ZW1JZCkge1xuICAgICAgICB1cmwgKz0gJyZwcm9kdWN0X2lkPScgKyBlc2NhcGUodGhpcy5pdGVtSWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jYXRlZ29yeU5hbWUpIHtcbiAgICAgICAgdXJsICs9ICcmY2F0ZWdvcnlfbmFtZT0nICsgZXNjYXBlKHRoaXMuY2F0ZWdvcnlOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYnJhbmRuYW1lKSB7XG4gICAgICAgIHVybCArPSAnJmJyYW5kbmFtZT0nICsgZXNjYXBlKHRoaXMuYnJhbmRuYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZ2VuZGVyKSB7XG4gICAgICAgIHVybCArPSAnJmdlbmRlcj0nICsgZXNjYXBlKHRoaXMuZ2VuZGVyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2Vzc2lvbklkKSB7XG4gICAgICAgIHVybCArPSAnJnNlc3Npb25faWQ9JyArIGVzY2FwZSh0aGlzLnNlc3Npb25JZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmxhbmd1YWdlKSB7XG4gICAgICAgIHVybCArPSAnJmxhbmd1YWdlPScgKyBlc2NhcGUodGhpcy5sYW5ndWFnZSk7XG4gICAgICB9XG5cbiAgICAgIHVybCArPSAnJmZvcm1hdD1odG1sJztcbiAgICAgIC8vIFByZXBhcmUgaWZyYW1lXG4gICAgICB2YXIgaWZyYW1lID0gc2VsZi5jcmVhdGVJRnJhbWVXaXRoSWQod2lkZ2V0SWQpO1xuXG4gICAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgICAgLy8gUmVuZGVyIGxvYWRlclxuICAgICAgdmFyIGh0bWwgPSBzZWxmLmdldExvYWRlckhUTUwoKTtcblxuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQub3BlbigpO1xuICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoaHRtbCk7XG4gICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgIC8vIERlbGV0ZSBsb2FkZXIgaWZyYW1lXG4gICAgICAgIHZhciBvbGRJRnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lkZ2V0LScgK1xuICAgICAgICB3aWRnZXRJZCk7XG5cbiAgICAgICAgdmFyIGlmcmFtZVBhcmVudCA9IG9sZElGcmFtZS5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChpZnJhbWVQYXJlbnQpIHtcbiAgICAgICAgICB3aGlsZSAoaWZyYW1lUGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGlmcmFtZVBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWVQYXJlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpZnJhbWUgZm9yIHdpZGdldFxuICAgICAgICB2YXIgaWZyYW1lID0gc2VsZi5jcmVhdGVJRnJhbWVXaXRoSWQod2lkZ2V0SWQpO1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgICAgICB2YXIgaHRtbCA9IHNlbGYuZGVjb2RlSHRtbEVudGl0aWVzKGRhdGEpO1xuXG4gICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50Lm9wZW4oKTtcbiAgICAgICAgICAgIGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LndyaXRlKGh0bWwpO1xuICAgICAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICczMHB4JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSHRtbCB3aWxsIGJlIGVtcHR5IGlmIHN0b3JlIGhhcyBydW4gb3V0IG9mIGZyZWUgc2FsZXMgY3JlZGl0cy5cbiAgICAgICAgICAgIC8vIEdyYWNlZnVsbHkgZmFpbCB0byBsb2FkIHdpZGdldCBieSByZW1vdmluZyB0aGUgaWZyYW1lIGZyb20gRE9NLlxuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgc3RhdHVzVGV4dCk7XG4gICAgICAgICAgLy8gUmVtb3ZlIGlmcmFtZSBmcm9tIERPTVxuICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cbiAgLyoqXG4gICAqIFN0YXJ0cyB0cmFja2luZyBieSBzdWJtaXR0aW5nIGl0ZW0gb3IgYWN0aW9uIGRhdGEgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhdCBDYXRlZ29yeSBuYW1lIG9mIGRhdGEgKGFsbG93ZWQgdmFsdWVzOiBgXCJpdGVtXCJgLGBcImFjdGlvblwiYClcbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgT2JqZWN0IG9mIGl0ZW0gb3IgYWN0aW9uIGRhdGFcbiAgICovXG5cbiAgdHJhY2soY2F0LCBkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ3RyYWNraW5nICcsIGNhdCk7XG4gICAgaWYgKHRoaXMuc2x1Zykge1xuICAgICAgaWYgKGNhdCA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlT3JVcGRhdGVJdGVtKGRhdGEpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY2F0ID09PSAnYWN0aW9uJykge1xuICAgICAgICB0aGlzLmNyZWF0ZU9yVXBkYXRlQWN0aW9uKGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGl0ZW0gaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIGl0ZW0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtRGF0YSBbaXRlbURhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjSXRlbS1kYXRhfSBvYmplY3QgdG8gYmUgc3VibWl0dGVkIHRvIHRoZSBpdGVtIEFQSSBlbmRwb2ludFxuICAgKi9cbiAgY3JlYXRlT3JVcGRhdGVJdGVtKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMuaXRlbUVuZHBvaW50O1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyLCBzZXR0aW5ncykge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xuICAgICAgfSxcbiAgICAgIHN0YXR1c0NvZGU6IHtcbiAgICAgICAgICA1MDA6IGZ1bmN0aW9uKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW50ZXJuYWwgc2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEsIHN0YXR1c1RleHQsIHhocikge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6ICcgKyB4aHIpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnJlc3BvbnNlSlNPTik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhY3Rpb24gaWYgaXQgZG9lcyBub3QgZXhpc3QgaW4gTWV0aXNhIG9yIHVwZGF0ZXMgdGhlIGFjdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbkRhdGEgW2FjdGlvbkRhdGFde0BsaW5rIEJST1dTRVIvU0NIRU1BLmh0bWwjQWN0aW9uLWRhdGF9IG9iamVjdCB0byBiZSBzdWJtaXR0ZWQgdG8gdGhlIGFjdGlvbiBBUEkgZW5kcG9pbnRcbiAgICovXG4gIGNyZWF0ZU9yVXBkYXRlQWN0aW9uKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gdGhpcy5vcHRzLmJhc2VVcmwgKyB0aGlzLnNsdWcgKyB0aGlzLm9wdHMuYWN0aW9uRW5kcG9pbnQ7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICB9LFxuICAgICAgc3RhdHVzQ29kZToge1xuICAgICAgICAgIDUwMDogZnVuY3Rpb24oZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InKTtcbiAgICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCBzdGF0dXNUZXh0LCB4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcycpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzVGV4dCwgeGhyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIHhocik7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEucmVzcG9uc2VKU09OKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgbG9ncyBhYm91dCByZWdpc3RlcmVkIG9wdGlvbnMgdG8gYnJvd3NlciBjb25zb2xlIHdoZW4gYGRlYnVnYCBwcm9wZXJ0eSBvZiBgTWV0aXNhRG9tYCBvYmplY3QgaXMgYHRydWVgXG4gICAqL1xuICBsb2coKSB7XG4gICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXRpc2FEb207XG4iLCIvKipcbiAqIFJldHVybnMge0BsaW5rIGNvbXBvc2VDbGFzcy5JRnJhbWV9IGNvbXBvc2VkIHdpdGggYGNvbXBvc2VkQ2xhc3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gIHtjbGFzc30gY29tcG9zZWRDbGFzcyBgY29tcG9zZWRDbGFzc2AgdG8gYmUgY29tcG9zZWQuXG4gKiBAcmV0dXJucyB7Y29tcG9zZUNsYXNzLklGcmFtZX1cbiAqL1xuXG52YXIgY29tcG9zZUNsYXNzID0gZnVuY3Rpb24oY29tcG9zZWRDbGFzcykge1xuICAvKipcbiAgICogYDxpZnJhbWU+YCBlbGVtZW50IGluIHRoZSByZWNvbW1lbmRhdGlvbiB3aWRnZXQuXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IElGcmFtZVxuICAgKiBAbWVtYmVyb2YgY29tcG9zZUNsYXNzXG4gICAqL1xuICByZXR1cm4gY2xhc3MgSUZyYW1lIGV4dGVuZHMgY29tcG9zZWRDbGFzcyB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgaWZyYW1lYCBlbGVtZW50XG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgUmVjb21tZW5kYXRpb24gd2lkZ2V0IElEXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIGNyZWF0ZUlGcmFtZVdpdGhJZChpZCkge1xuICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsICdib3JkZXI6IDBweDsgd2lkdGg6IDEwMCU7Jyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdmcmFtZWJvcmRlcicsICcwJyk7XG4gICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzY3JvbGxpbmcnLCAnbm8nKTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ29ubG9hZCcsICd3aW5kb3cuTWV0aXNhLnJlc2l6ZUlmcmFtZSh0aGlzKScpO1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2lkZ2V0LScgKyBpZCk7XG5cbiAgICAgIHJldHVybiBpZnJhbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyBgaWZyYW1lYCBlbGVtZW50XG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogYGlmcmFtZWAgZWxlbWVudCB0byBiZSByZXNpemVkLlxuICAgICAqL1xuICAgIHJlc2l6ZUlmcmFtZShvYmopIHtcbiAgICAgIG9iai5zdHlsZS5oZWlnaHQgPSAwO1xuICAgICAgb2JqLnN0eWxlLmhlaWdodCA9IG9iai5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGxvYWRlciBIVE1MXG4gICAgICogQG1lbWJlcm9mIGNvbXBvc2VDbGFzcy5JRnJhbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldExvYWRlckhUTUwoKSB7XG4gICAgICByZXR1cm4gJzwhZG9jdHlwZSBodG1sPjxodG1sPjxzdHlsZT5ib2R5e2hlaWdodDogMTAwcHg7fS5jcy1sb2FkZXJ7aGVpZ2h0OiAxMDAlOyB3aWR0aDogMTAwJTt9LmNzLWxvYWRlci1pbm5lcnt0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7IHRvcDogNTAlOyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiBjYWxjKDEwMCUgLSAyMDBweCk7IGNvbG9yOiAjQTJBM0EzOyBwYWRkaW5nOiAwIDEwMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWx7Zm9udC1zaXplOiAyMHB4OyBvcGFjaXR5OiAwOyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7fUBrZXlmcmFtZXMgbG9sezAle29wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTY2JXtvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9MTAwJXtvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319QC13ZWJraXQta2V5ZnJhbWVzIGxvbHswJXtvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO30zMyV7b3BhY2l0eTogMTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTt9NjYle29wYWNpdHk6IDE7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDBweCk7fTEwMCV7b3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO319LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNil7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDUpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgMTAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg0KXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9LmNzLWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMyl7LXdlYmtpdC1hbmltYXRpb246IGxvbCAzcyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDsgYW5pbWF0aW9uOiBsb2wgM3MgMzAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7fS5jcy1sb2FkZXItaW5uZXIgbGFiZWw6bnRoLWNoaWxkKDIpey13ZWJraXQtYW5pbWF0aW9uOiBsb2wgM3MgNDAwbXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7IGFuaW1hdGlvbjogbG9sIDNzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O30uY3MtbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgxKXstd2Via2l0LWFuaW1hdGlvbjogbG9sIDNzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0OyBhbmltYXRpb246IGxvbCAzcyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDt9PC9zdHlsZT48Ym9keT4gPGRpdiBjbGFzcz1cImNzLWxvYWRlclwiPiA8ZGl2IGNsYXNzPVwiY3MtbG9hZGVyLWlubmVyXCI+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDxsYWJlbD7il488L2xhYmVsPiA8bGFiZWw+4pePPC9sYWJlbD4gPGxhYmVsPuKXjzwvbGFiZWw+IDwvZGl2PjwvZGl2PjwvYm9keT48L2h0bWw+JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRlY29kZWQgSFRNTCBlbnRpdGllc1xuICAgICAqIEBtZW1iZXJvZiBjb21wb3NlQ2xhc3MuSUZyYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBIVE1MIGVudGl0aWVzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBkZWNvZGVIdG1sRW50aXRpZXMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyYjPyhcXHcrKTsvZywgZnVuY3Rpb24obWF0Y2gsIGRlYykge1xuICAgICAgICBpZiAoaXNOYU4oZGVjKSkge1xuICAgICAgICAgIHZhciBjaGFycyA9IHtcbiAgICAgICAgICAgIHF1b3Q6IDM0LFxuICAgICAgICAgICAgYW1wOiAzOCxcbiAgICAgICAgICAgIGx0OiA2MCxcbiAgICAgICAgICAgIGd0OiA2MixcbiAgICAgICAgICAgIG5ic3A6IDE2MCxcbiAgICAgICAgICAgIGNvcHk6IDE2OSxcbiAgICAgICAgICAgIHJlZzogMTc0LFxuICAgICAgICAgICAgZGVnOiAxNzYsXG4gICAgICAgICAgICBmcmFzbDogNDcsXG4gICAgICAgICAgICB0cmFkZTogODQ4MixcbiAgICAgICAgICAgIGV1cm86IDgzNjQsXG4gICAgICAgICAgICBBZ3JhdmU6IDE5MixcbiAgICAgICAgICAgIEFhY3V0ZTogMTkzLFxuICAgICAgICAgICAgQWNpcmM6IDE5NCxcbiAgICAgICAgICAgIEF0aWxkZTogMTk1LFxuICAgICAgICAgICAgQXVtbDogMTk2LFxuICAgICAgICAgICAgQXJpbmc6IDE5NyxcbiAgICAgICAgICAgIEFFbGlnOiAxOTgsXG4gICAgICAgICAgICBDY2VkaWw6IDE5OSxcbiAgICAgICAgICAgIEVncmF2ZTogMjAwLFxuICAgICAgICAgICAgRWFjdXRlOiAyMDEsXG4gICAgICAgICAgICBFY2lyYzogMjAyLFxuICAgICAgICAgICAgRXVtbDogMjAzLFxuICAgICAgICAgICAgSWdyYXZlOiAyMDQsXG4gICAgICAgICAgICBJYWN1dGU6IDIwNSxcbiAgICAgICAgICAgIEljaXJjOiAyMDYsXG4gICAgICAgICAgICBJdW1sOiAyMDcsXG4gICAgICAgICAgICBFVEg6IDIwOCxcbiAgICAgICAgICAgIE50aWxkZTogMjA5LFxuICAgICAgICAgICAgT2dyYXZlOiAyMTAsXG4gICAgICAgICAgICBPYWN1dGU6IDIxMSxcbiAgICAgICAgICAgIE9jaXJjOiAyMTIsXG4gICAgICAgICAgICBPdGlsZGU6IDIxMyxcbiAgICAgICAgICAgIE91bWw6IDIxNCxcbiAgICAgICAgICAgIHRpbWVzOiAyMTUsXG4gICAgICAgICAgICBPc2xhc2g6IDIxNixcbiAgICAgICAgICAgIFVncmF2ZTogMjE3LFxuICAgICAgICAgICAgVWFjdXRlOiAyMTgsXG4gICAgICAgICAgICBVY2lyYzogMjE5LFxuICAgICAgICAgICAgVXVtbDogMjIwLFxuICAgICAgICAgICAgWWFjdXRlOiAyMjEsXG4gICAgICAgICAgICBUSE9STjogMjIyLFxuICAgICAgICAgICAgc3psaWc6IDIyMyxcbiAgICAgICAgICAgIGFncmF2ZTogMjI0LFxuICAgICAgICAgICAgYWFjdXRlOiAyMjUsXG4gICAgICAgICAgICBhY2lyYzogMjI2LFxuICAgICAgICAgICAgYXRpbGRlOiAyMjcsXG4gICAgICAgICAgICBhdW1sOiAyMjgsXG4gICAgICAgICAgICBhcmluZzogMjI5LFxuICAgICAgICAgICAgYWVsaWc6IDIzMCxcbiAgICAgICAgICAgIGNjZWRpbDogMjMxLFxuICAgICAgICAgICAgZWdyYXZlOiAyMzIsXG4gICAgICAgICAgICBlYWN1dGU6IDIzMyxcbiAgICAgICAgICAgIGVjaXJjOiAyMzQsXG4gICAgICAgICAgICBldW1sOiAyMzUsXG4gICAgICAgICAgICBpZ3JhdmU6IDIzNixcbiAgICAgICAgICAgIGlhY3V0ZTogMjM3LFxuICAgICAgICAgICAgaWNpcmM6IDIzOCxcbiAgICAgICAgICAgIGl1bWw6IDIzOSxcbiAgICAgICAgICAgIGV0aDogMjQwLFxuICAgICAgICAgICAgbnRpbGRlOiAyNDEsXG4gICAgICAgICAgICBvZ3JhdmU6IDI0MixcbiAgICAgICAgICAgIG9hY3V0ZTogMjQzLFxuICAgICAgICAgICAgb2NpcmM6IDI0NCxcbiAgICAgICAgICAgIG90aWxkZTogMjQ1LFxuICAgICAgICAgICAgb3VtbDogMjQ2LFxuICAgICAgICAgICAgZGl2aWRlOiAyNDcsXG4gICAgICAgICAgICBvc2xhc2g6IDI0OCxcbiAgICAgICAgICAgIHVncmF2ZTogMjQ5LFxuICAgICAgICAgICAgdWFjdXRlOiAyNTAsXG4gICAgICAgICAgICB1Y2lyYzogMjUxLFxuICAgICAgICAgICAgdXVtbDogMjUyLFxuICAgICAgICAgICAgeWFjdXRlOiAyNTMsXG4gICAgICAgICAgICB0aG9ybjogMjU0LFxuICAgICAgICAgICAgeXVtbDogMjU1LFxuICAgICAgICAgICAgbHNxdW86IDgyMTYsXG4gICAgICAgICAgICByc3F1bzogODIxNyxcbiAgICAgICAgICAgIHNicXVvOiA4MjE4LFxuICAgICAgICAgICAgbGRxdW86IDgyMjAsXG4gICAgICAgICAgICByZHF1bzogODIyMSxcbiAgICAgICAgICAgIGJkcXVvOiA4MjIyLFxuICAgICAgICAgICAgZGFnZ2VyOiA4MjI0LFxuICAgICAgICAgICAgRGFnZ2VyOiA4MjI1LFxuICAgICAgICAgICAgcGVybWlsOiA4MjQwLFxuICAgICAgICAgICAgbHNhcXVvOiA4MjQ5LFxuICAgICAgICAgICAgcnNhcXVvOiA4MjUwLFxuICAgICAgICAgICAgc3BhZGVzOiA5ODI0LFxuICAgICAgICAgICAgY2x1YnM6IDk4MjcsXG4gICAgICAgICAgICBoZWFydHM6IDk4MjksXG4gICAgICAgICAgICBkaWFtczogOTgzMCxcbiAgICAgICAgICAgIG9saW5lOiA4MjU0LFxuICAgICAgICAgICAgbGFycjogODU5MixcbiAgICAgICAgICAgIHVhcnI6IDg1OTMsXG4gICAgICAgICAgICByYXJyOiA4NTk0LFxuICAgICAgICAgICAgZGFycjogODU5NSxcbiAgICAgICAgICAgIGhlbGxpcDogMTMzLFxuICAgICAgICAgICAgbmRhc2g6IDE1MCxcbiAgICAgICAgICAgIG1kYXNoOiAxNTEsXG4gICAgICAgICAgICBpZXhjbDogMTYxLFxuICAgICAgICAgICAgY2VudDogMTYyLFxuICAgICAgICAgICAgcG91bmQ6IDE2MyxcbiAgICAgICAgICAgIGN1cnJlbjogMTY0LFxuICAgICAgICAgICAgeWVuOiAxNjUsXG4gICAgICAgICAgICBicnZiYXI6IDE2NixcbiAgICAgICAgICAgIGJya2JhcjogMTY2LFxuICAgICAgICAgICAgc2VjdDogMTY3LFxuICAgICAgICAgICAgdW1sOiAxNjgsXG4gICAgICAgICAgICBkaWU6IDE2OCxcbiAgICAgICAgICAgIG9yZGY6IDE3MCxcbiAgICAgICAgICAgIGxhcXVvOiAxNzEsXG4gICAgICAgICAgICBub3Q6IDE3MixcbiAgICAgICAgICAgIHNoeTogMTczLFxuICAgICAgICAgICAgbWFjcjogMTc1LFxuICAgICAgICAgICAgaGliYXI6IDE3NSxcbiAgICAgICAgICAgIHBsdXNtbjogMTc3LFxuICAgICAgICAgICAgc3VwMjogMTc4LFxuICAgICAgICAgICAgc3VwMzogMTc5LFxuICAgICAgICAgICAgYWN1dGU6IDE4MCxcbiAgICAgICAgICAgIG1pY3JvOiAxODEsXG4gICAgICAgICAgICBwYXJhOiAxODIsXG4gICAgICAgICAgICBtaWRkb3Q6IDE4MyxcbiAgICAgICAgICAgIGNlZGlsOiAxODQsXG4gICAgICAgICAgICBzdXAxOiAxODUsXG4gICAgICAgICAgICBvcmRtOiAxODYsXG4gICAgICAgICAgICByYXF1bzogMTg3LFxuICAgICAgICAgICAgZnJhYzE0OiAxODgsXG4gICAgICAgICAgICBmcmFjMTI6IDE4OSxcbiAgICAgICAgICAgIGZyYWMzNDogMTkwLFxuICAgICAgICAgICAgaXF1ZXN0OiAxOTEsXG4gICAgICAgICAgICBBbHBoYTogOTEzLFxuICAgICAgICAgICAgYWxwaGE6IDk0NSxcbiAgICAgICAgICAgIEJldGE6IDkxNCxcbiAgICAgICAgICAgIGJldGE6IDk0NixcbiAgICAgICAgICAgIEdhbW1hOiA5MTUsXG4gICAgICAgICAgICBnYW1tYTogOTQ3LFxuICAgICAgICAgICAgRGVsdGE6IDkxNixcbiAgICAgICAgICAgIGRlbHRhOiA5NDgsXG4gICAgICAgICAgICBFcHNpbG9uOiA5MTcsXG4gICAgICAgICAgICBlcHNpbG9uOiA5NDksXG4gICAgICAgICAgICBaZXRhOiA5MTgsXG4gICAgICAgICAgICB6ZXRhOiA5NTAsXG4gICAgICAgICAgICBFdGE6IDkxOSxcbiAgICAgICAgICAgIGV0YTogOTUxLFxuICAgICAgICAgICAgVGhldGE6IDkyMCxcbiAgICAgICAgICAgIHRoZXRhOiA5NTIsXG4gICAgICAgICAgICBJb3RhOiA5MjEsXG4gICAgICAgICAgICBpb3RhOiA5NTMsXG4gICAgICAgICAgICBLYXBwYTogOTIyLFxuICAgICAgICAgICAga2FwcGE6IDk1NCxcbiAgICAgICAgICAgIExhbWJkYTogOTIzLFxuICAgICAgICAgICAgbGFtYmRhOiA5NTUsXG4gICAgICAgICAgICBNdTogOTI0LFxuICAgICAgICAgICAgbXU6IDk1NixcbiAgICAgICAgICAgIE51OiA5MjUsXG4gICAgICAgICAgICBudTogOTU3LFxuICAgICAgICAgICAgWGk6IDkyNixcbiAgICAgICAgICAgIHhpOiA5NTgsXG4gICAgICAgICAgICBPbWljcm9uOiA5MjcsXG4gICAgICAgICAgICBvbWljcm9uOiA5NTksXG4gICAgICAgICAgICBQaTogOTI4LFxuICAgICAgICAgICAgcGk6IDk2MCxcbiAgICAgICAgICAgIFJobzogOTI5LFxuICAgICAgICAgICAgcmhvOiA5NjEsXG4gICAgICAgICAgICBTaWdtYTogOTMxLFxuICAgICAgICAgICAgc2lnbWE6IDk2MyxcbiAgICAgICAgICAgIFRhdTogOTMyLFxuICAgICAgICAgICAgdGF1OiA5NjQsXG4gICAgICAgICAgICBVcHNpbG9uOiA5MzMsXG4gICAgICAgICAgICB1cHNpbG9uOiA5NjUsXG4gICAgICAgICAgICBQaGk6IDkzNCxcbiAgICAgICAgICAgIHBoaTogOTY2LFxuICAgICAgICAgICAgQ2hpOiA5MzUsXG4gICAgICAgICAgICBjaGk6IDk2NyxcbiAgICAgICAgICAgIFBzaTogOTM2LFxuICAgICAgICAgICAgcHNpOiA5NjgsXG4gICAgICAgICAgICBPbWVnYTogOTM3LFxuICAgICAgICAgICAgb21lZ2E6IDk2OVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoY2hhcnNbZGVjXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkZWMgPSBjaGFyc1tkZWNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShkZWMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlQ2xhc3M7XG4iLCJjb25zdCBNZXRpc2FEb20gPSByZXF1aXJlKCcuL01ldGlzYS9kb20nKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuXG4vKipcbiAqIExvYWRzIGpRdWVyeSBhbmQge0BsaW5rIE1ldGlzYURvbX0gb2JqZWN0IGludG8gd2luZG93IG9iamVjdCBpbiBicm93c2VyXG4gKiBAcHJpdmF0ZVxuICogQHJlcXVpcmVzIE1ldGlzYURvbVxuICogQHJlcXVpcmVzIGdldFV0aWxcbiAqL1xuZnVuY3Rpb24gYnJvd3NlcigpIHtcbiAgaWYgKHV0aWwuZW52aXJvbm1lbnQgIT09ICdicm93c2VyJyApIHtcbiAgICByZXR1cm4gY29uc29sZS53YXJuKCdNZXRpc2EgYnJvd3NlciBjYW4gb25seSBydW4gaW5zaWRlIGEgYnJvd3NlcicpO1xuICB9XG4gIHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9ICQgfHwgalF1ZXJ5IHx8IHt9O1xuXG4gIHdpbmRvdy5NZXRpc2EgPSBuZXcgTWV0aXNhRG9tKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKGJyb3dzZXIpKCk7XG4iLCIvKipcbiAqIEdldHMgU0RLIHV0aWxpdGllc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7VXRpbE9ian1cbiAqL1xuZnVuY3Rpb24gZ2V0VXRpbCgpIHtcbiAgLyoqXG4gICAqIE9iamVjdCBjb250YWluaW5nIHV0aWxpbGl0aWVzXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IFV0aWxPYmpcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGVudmlyb25tZW50IEVudmlyb25tZW50IHRoYXQgTWV0aXNhIG9iamVjdCBpcyBleHBvc2VkIHRvLiBSZXR1cm5zIGAnYnJvd3NlcidgIG9yIGBub2RlYC5cbiAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gY29tcG9zZSBbRnVuY3Rpb25dKCNHZXRVdGlsLWNvbXBvc2VGdW5jKSBmb3IgY29tcG9zaW5nIGNsYXNzZXNcbiAgICogQG1lbWJlcm9mIGdldFV0aWxcbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29tcG9zZWQgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSAge2NsYXNzfSBvcmlnaW5hbCBDbGFzcyB0byBiZSBjb21wb3NlZCB0by5cbiAgICogQHJldHVybiB7Y2xhc3N9XG4gICAqL1xuICB2YXIgY29tcG9zZUZ1bmMgPSBmdW5jdGlvbihvcmlnaW5hbCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0aW9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgY29tcG9zZWQgPSBvcmlnaW5hbDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbXBvc2VkID0gY29tcG9zaXRpb25zW2ldKGNvbXBvc2VkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21wb3NlZDtcbiAgICB9XG4gIH07XG4gIHJldHVybiB7XG4gICAgZW52aXJvbm1lbnQ6IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gJ2Jyb3dzZXInIDogJ25vZGUnLFxuICAgIGNvbXBvc2U6IGNvbXBvc2VGdW5jLFxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSAoZ2V0VXRpbCkoKTtcbiJdfQ==
