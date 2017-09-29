## Data schema for API endpoints

Like every API, there is a fixed format in the data that the Metisa endpoints expect. The schema for Item and Action endpoints are detailed below (**required fields** are indicated in **bold**):

### Item data

Item data consists of these key value pairs:
- **`id`** Item ID
- `name` Item name
- `maker` Value of the attribute to categorize the items
- **`variants`** The list of variants of this item
  - **`id`** Variant ID
  - `availability` Number of items available for sale
  - `image_url` URL of item variant image source
  - **`url`** URL to the item variant
  - `price` Item variant's regular price
  - `price_discounted` Item variant's discounted price

Item information can be tricky, because different e-commerce platforms save items and their variants differently.

In Metisa, we save item variants instead of the item itself. This means there is a specific way to send data about items with and without variants.

The following are examples of `itemData` handled in different kind of application:

##### Example 1: Product with variants

A product that has a variant with 2 options, e.g. a pair of shoes with Blue and Green color options.

```js
var itemData = {
  id: '81923681',
  name: 'Running Shoes',
  maker: 'Nike', // brand name
  variants: [
    {
      id: '5953504327',
      name: 'Blue',
      availability: 10,
      image_url: 'https://amazingshoes.com/nike-running-shoes-blue.png',
      url: 'https://amazingshoes.com/products/nike-running-shoes?variant_id=5953504327',
      price: '99.90'
      price_discounted: '80'
    },
    {
      id: '5953504331',
      name: 'Green',
      availability: 0, // 0 indicates this variant is out of stock
      image_url: 'https://amazingshoes.com/nike-running-shoes-green.png',
      url: 'https://amazingshoes.com/products/nike-running-shoes?variant_id=5953504331',
      price: '99.90',
      price_discounted: '80'
    }
  ]
}
```

##### Example 2: Product without variants

The same pair of shoes has no variants and comes only in a single color and size.

```js
var itemData = {
  id: '81923681',
  name: 'Running Shoes',
  maker: 'Nike', // brand name
  variants: [
    {
      id: '81923681',
      name: null,  // null indicates this product has no variants
      availability: 3,
      image_url: 'https://amazingshoes.com/nike-running-shoes.png',
      url: 'https://amazingshoes.com/products/nike-running-shoes',
      price: '99.90',
      price_discounted: null
    }
  ]
}
```

##### Example 3: Song with variants

A song released as single and then in an album.

```js
var itemData = {
  id: '12334',
  name: 'Million Reasons',
  maker: 'Lady Gaga', // artist name
  variants: [
    {
      id: '12334',
      name: null, // null indicates this song is released as single
      availability: null,
      image_url: 'http://www.example.com/million-reasons.jpg',
      url: 'http://www.example.com/million-reasons',
      price: null,
      price_discounted: null
    },
    {
      id: '22345', // album ID
      name: 'Joanne', // album title
      availability: null,
      image_url: 'http://www.example.com/joanne.jpg',
      url: 'http://www.example.com/joanne/million-reasons',
      price: null,
      price_discounted: null
    }
  ]
}
```


##### Example 4: Song without variants

A song released as single.

```js
var itemData = {
  id: '12335',
  name: 'The Cure',
  maker: 'Lady Gaga', // artist name
  variants: [
    {
      id: '12335',
      name: null, // null indicates this song is released as single
      availability: null,
      image_url: 'http://www.example.com/the-cure.jpg',
      url: 'http://www.example.com/the-cure',
      price: null,
      price_discounted: null
    }
  ]
}
```

##### Example 5: News article

An article in newspaper app.

```js
var itemData = {
  id: '23145',
  name: 'Home-run beauty, skincare labels turn to natural products such as coffee ground',
  maker: 'Fashion',
  variants: [
    {
      id: '23145',
      name: null,
      image_url: 'http://www.example.com/home-run-beauty-skincare-labels-turn-to-natural-products-such-as-coffee-ground.jpg',
      url: 'http://www.example.com/home-run-beauty-skincare-labels-turn-to-natural-products-such-as-coffee-ground'
    }
  ]
}
```

> **Important:**
> - Even if an item has no variant, the `variants` array **must** still have a single object describing the item itself. The `variant[0].id` should be identical to `id`, and `name` should be `null`.
> - For optional (i.e. non-required) fields, if there is no data about the fields or the fields are not applicable to the item, those fields can be either `null` or omitted.
> - If there are missing fields, Metisa will specify them in the HTTP 400 response.

### Action data

Action data consists of these key value pairs:
- `id` Action ID
- **`user`** Data about who is using your app
  - **`id`** User ID
  - `first_name` User first name
  - `last_name` User last name
  - `email` User email address
- `currency` Three-character currency symbol
- **`line_items`** The list of items involved in the action
  - **`variant_id`** ID of the item variant
  - `price` Unit price of the item variant
  - `quantity` Quantity of the item variant involved in the action
  - **`item_id`** ID of the parent item
  - `total_discount` Discount applied to the line item (factoring in quantity)

##### Example 1: Product checkout

```js
var actionData = {
  id: '823413',
  user: {
    id: '3712',
    first_name: 'James',
    last_name: 'Schwartz',
    email: 'james@hostmail.com'
  },
  currency: "USD",
  line_items: [
    {
      variant_id: '5953504331',
      quantity: 1,
      price: '99.90',
      item_id: '81923681',
      total_discount: '0.0'
    },
    {
      variant_id: '5953504300',
      quantity: 2,
      price: '129.90',
      item_id: '81923622',
      total_discount: '10.0'
    }
  ]
}
```

##### Example 2: Browsing an news article

```js
var actionData = {
  id: '1234',
  user: {
    id: '0',
    first_name: null,
    last_name: null,
    email: 'tester@exmaple.com',
  },
  line_items: [
    {
      variant_id: '34454',
      item_id: '34454'
    }
  ]
}
```

> **Important:**
> - If your app supports "guest" users (eg. guest checkouts) where ID is not generated yet, please use a temporary unique ID for the `user.id` as it is a required field. In this case, user.email will be used to identify the user.
> - If there are missing fields, Metisa will specify them in the HTTP 400 response.
