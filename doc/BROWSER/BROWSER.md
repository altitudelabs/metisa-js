## Browser

The `browser.js` script makes HTTP requests that:
- Sends product and order data to Metisa server
- Gets widget HTML and render widget on your site

Once the script has been installed in the correct places in your app backend, it will work faithfully to keep Metisa up to date with your Product and Order records. This data forms the basis for recommendations.

##### Options

```js
// Add to all pages (via base template). Used to point to the right API endpoint
mt('store', '{{ slug }}');

// Add to product template. Used to update/create product in Metisa
mt('product', '{{ product }}');

// Add to order checkout template. Used to update/create order in Metisa
mt('order', '{{ order }}');

/**
 * Add to every page that has recommendation widget.
 * Used to show personalized recommendations (eg. "You may also like")
 */
mt('customer', '{{ customer.id }}');

/**
 * Add to every page that has recommendation widget.
 * Used to show item-based recommendations (eg. "People who bought this also bought")
 */
mt('product', '{{ product.id }}');
```
