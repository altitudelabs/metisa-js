## Browser

The `browser.js` script makes HTTP requests that:
- Sends item and action data browsed by users to Metisa server
- Gets recommendation widget HTML and render widget on your site

Once the script has been installed in the correct places in the templates of your website, it will work faithfully to keep Metisa up to date with your Item and Action records.

<br />
##### Options
The following code snippets are options for different templates:

```js
/**
 * Add to all pages (via base template).
 * Used to point to the right API endpoint.
 */
mt('slug', '{{ metisa_account_slug }}');

/**
 * Add to the template that contains the information of a single item.
 * Used to update/create items in Metisa.
 */
mt('item', {{ itemData }});

/**
 * Add to template that performs action on an item/a batch of items.
 * Used to update/create actions in Metisa.
 */
mt('action', {{ actionData }});

/**
 * Add to every page that has the recommendation widget.
 * Used to show personalized recommendations (eg. "You may also like")
 */
mt('user', {{ userId }});

/**
 * Add to every page that has the recommendation widget.
 * Used to show item-based recommendations (eg. "People who bought this also bought")
 */
mt('itemId', {{ itemId }});
```
