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
