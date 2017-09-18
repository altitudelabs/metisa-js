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
