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
