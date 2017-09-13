## Data schema for API endpoints

Like every API, there is a fixed format in the data that the Metisa endpoints expect. The schema for Product and Order endpoints are detailed below.

### Product data

Product information can be tricky, because different e-commerce platforms save products and their variants differently.

In Metisa, we save product variants instead of the product itself. This means there is a specific way to send data about products with and without variants.

##### Example 1: Product with variants

For example, if a product has 2 variants, say a pair of shoes with Blue and Green color options, the data object would look like this.

```js
var productData = {
  id: '81923681',
  name: 'Running Shoes',
  brand: 'Nike',
  variants: [
    {
      id: '5953504327',
      name: 'Blue',
      availability: 10,
      image_url: 'https://amazingshoes.com/nike-running-shoes-blue.png',
      url: 'https://amazingshoes.com/products/nike-running-shoes?variant_id=5953504327',
      price: "99.90",
      price_discounted: null
    },
    {
      id: '5953504331',
      name: 'Green',
      availability: 3,
      image_url: 'https://amazingshoes.com/nike-running-shoes-green.png',
      url: 'https://amazingshoes.com/products/nike-running-shoes?variant_id=5953504331',
      price: "99.90",
      price_discounted: null
    }
  ]
}
```

##### Example 2: Product with no variants

Now let's say the same pair of shoes has no variants and comes only in a single color and size.

```js
var productData = {
  id: '81923681',
  name: 'Running Shoes',
  brand: 'Nike',
  variants: [
    {
      id: '81923681',
      name: null,  // null indicates this product has no variants
      availability: 3,
      image_url: 'https://amazingshoes.com/nike-running-shoes.png',
      url: 'https://amazingshoes.com/products/nike-running-shoes',
      price: "99.90",
      price_discounted: null
    }
  ]
}
```

**Important:**
- Even if a product has no variant, the `variants` array **must** still have a single object describing the product itself. The `variant[0].id` should be identical to `id`, and `name` should be `null`.
- If there are missing fields, Metisa will specify them in the HTTP 400 response.

### Order data

Order data consist of these key value pairs:
- `id` ID of this order
- `customer` Data about who just bought from your store
  - `id` ID of the customer, `null` means "guest" checkout
  - `first_name` First name
  - `last_name` Last name
  - `email` Email address
- `currency` Three character currency symbol
- `line_items` The list of products purchased
  - `variant_id` The ID of the product _variant_ (or product ID if no variant)
  - `price` Unit price of the product variant
  - `quantity` Quantity of the product variant purchased
  - `product_id` ID of the parent product
  - `total_discount` Discount applied to the line item (factoring in quantity)

##### Example order

```js
var orderData = {
  id: '823413',
  customer: {
    id: '3712',
    first_name: "James",
    last_name: "Schwartz",
    email: "james@hostmail.com"
  },
  currency: "USD",
  line_items: [
    {
      variant_id: '5953504331',
      quantity: 1,
      price: "99.90",
      product_id: '81923681',
      total_discount: "0.0"
    },
    {
      variant_id: '5953504300',
      quantity: 2,
      price: "129.90",
      product_id: '81923622',
      total_discount: "10.0"
    }
  ]
}
```

**Important:**
- If there are missing fields, Metisa will specify them in the HTTP 400 response.
