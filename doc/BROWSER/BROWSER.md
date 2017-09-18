## Browser

The `browser.js` script makes HTTP requests that:
- Sends product and order data browsed by customers to Metisa server
- Gets recommendaton widget HTML and render widget on your site

Once the script has been installed in the correct places in the templates of your store, it will work faithfully to keep Metisa up to date with your Product and Order records.

<br />
##### Options
The following code snippets are options for different templates:

```js
// Add to all pages (via base template). Used to point to the right API endpoint
mt('store', '{{ your_metisa_account_slug }}');

// Add to product template. Used to update/create product in Metisa
mt('product', {{ productData }});

// Add to order checkout template. Used to update/create order in Metisa
mt('order', {{ orderData }});

/**
 * Add to every page that has the recommendation widget.
 * Used to show personalized recommendations (eg. "You may also like")
 */
mt('customer', {{ customer.id }});

/**
 * Add to every page that has the recommendation widget.
 * Used to show item-based recommendations (eg. "People who bought this also bought")
 */
mt('productId', {{ product.id }});
```
