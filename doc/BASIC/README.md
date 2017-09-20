## Basics

Metisa has two main functions:

* [Tracking](#Tracking)
* [Recommendation](#Recommendaton)

<br />
##### Tracking

Metisa tracks your users' individual behaviour in order to come up with better personalized recommendations.

```html
<script>
  mt('slug', '{{ metisa_account_slug }}');
  mt('item', {{ itemData }});
  mt('action', {{ actionData }});
</script>
```
<br />
##### Recommendation

Once the tracking is set up, Metisa can now start providing personalized recommendations for your users that get more accurate with time.

```html
<!-- Place wherever you want the widget to be rendered -->
<div class="mt-widget" data-widget-id="{{ widget_id }}"></div>

<script>
  mt('slug', '{{ metisa_account_slug }}');
</script>
```
