## Basics

Metisa has two main functions:
* [Tracking](#tracking)
* [Recommendation](#recommendaton)

##### Tracking

Metisa tracks your users' behaviour or purchases in order to come up with better personalised recommendations.

```html
<script>
  mt('product', productData);
  mt('order', orderData);
</script>
```

##### Recommendation

```html
<!-- Place wherever you want the widget to be rendered -->
<div class="mt-widget" data-widget-id=9423></div>

<script>
  mt('store', yourMetisaAccountSlug);
</script>
```

Once the tracking is set up, Metisa can now start feeding personalised recommendations for your users.
