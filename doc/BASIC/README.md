## Basics

Metisa has two main functions:

* [Tracking](#tracking)
* [Recommendation](#recommendaton)

<br />
##### Tracking

Metisa tracks your customers' individual behaviour or purchases in order to come up with better personalized recommendations.

```html
<script>
  mt('store', '{{ your_metisa_account_slug }}');
  mt('product', {{ productData }});
  mt('order', {{ orderData }});
</script>
```
<br />
##### Recommendation

Once the tracking is set up, Metisa can now start providing personalized recommendations for your customers that get more accurate with time.

```html
<!-- Place wherever you want the widget to be rendered -->
<div class="mt-widget" data-widget-id="{{ widget_id }}"></div>

<script>
  mt('store', '{{ your_metisa_account_slug }}');
</script>
```
